const bcrypt = require('bcryptjs');
const db = require('../banco/database');  // Seu arquivo de conexão com o banco

// Função para pegar todos os usuários
const listarUsuarios = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

// Função para pegar um usuário por ID
const buscarUsuarioPorId = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, email, role FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};


// Função para pegar um usuário por email (usada no login)
const buscarUsuarioPorEmail = (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';

  return new Promise((resolve, reject) => {
    db.get(sql, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
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
  const { name, email, password, role } = data;
  const hashedPassword = bcrypt.hashSync(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID, name, email, role });
      }
    );
  });
};

// Função para atualizar um usuário
const atualizarUsuario = (id, data) => {
  const { name, email, password, role } = data;
  const sql = password
    ? 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?'
    : 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';

  const params = password
    ? [name, email, bcrypt.hashSync(password, 10), role, id]
    : [name, email, role, id];

  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
    } else if (this.changes > 0) {
      resolve({ id, name, email, role });
    } else {
      resolve(null); // Nenhum usuário foi atualizado
    }
    });
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
