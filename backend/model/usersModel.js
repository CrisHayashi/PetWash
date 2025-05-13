const bcrypt = require('bcryptjs');
const db = require('../banco/database');  // Seu arquivo de conexão com o banco

// Função para pegar todos os usuários
const listarUsuarios = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name, email FROM users', [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

// Função para pegar um usuário por ID
const buscarUsuarioPorId = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, email FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};



// Função para pegar um usuário por email (usada no login)
const buscarUsuarioPorEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

// Função para verificar a senha durante o login
const verificarSenha = async (email, password) => {
  const user = await buscarUsuarioPorEmail(email);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const senhaValida = await bcrypt.compare(password, user.password);
  if (!senhaValida) {
    throw new Error('Senha incorreta');
  }

  return user;
};

// Função para criar um novo usuário
const criarUsuario = (data) => {
  const { name, email, password } = data;
  const hashedPassword = bcrypt.hashSync(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID, name, email });
      }
    );
  });
};

// Função para atualizar um usuário
const atualizarUsuario = (id, data) => {
  const { name, email, password } = data;
  const hashedPassword = bcrypt.hashSync(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
      [name, email, hashedPassword, id],
      function (err) {
        if (err) reject(err);
        resolve({ id, name, email });
      }
    );
  });
};

// Função para deletar um usuário
const deletarUsuario = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) reject(err);
      resolve(this.changes > 0);
    });
  });
};

// Exportando tudo
module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
  verificarSenha
};
