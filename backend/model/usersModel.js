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
  const { name, email, password } = data;
  const hashedPassword = bcrypt.hashSync(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function (err) {
        if (err) {
          // Verifica erro de e-mail duplicado (SQLite código 19 = constraint failed)
          if (err.code === 'SQLITE_CONSTRAINT') {
            reject({ success: false, message: 'E-mail já cadastrado.' });
          } else {
            reject({ success: false, message: 'Erro ao criar usuário.', error: err.message });
          }
        } else {
          resolve({ success: true, message: 'Usuário criado com sucesso!', user: { id: this.lastID, name, email } });
        }
      }
    );
  });
};

// Função para atualizar um usuário
const atualizarUsuario = (id, data) => {
  const { name, email, password } = data;
  const sql = password
    ? 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?'
    : 'UPDATE users SET name = ?, email = ? WHERE id = ?';

  const params = password
    ? [name, email, bcrypt.hashSync(password, 10), id]
    : [name, email, id];

  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
    } else if (this.changes > 0) {
      resolve({ id, name, email});
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
