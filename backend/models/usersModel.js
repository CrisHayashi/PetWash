const bcrypt = require('bcryptjs');
const db = require('../banco/database');  // Seu arquivo de conexão com o banco
const saltRounds = 10;

// Função para pegar todos os usuários sem senha
const listarUsuarios = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name, email FROM users', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Função para pegar um usuário por ID sem senha
const buscarUsuarioPorId = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, email FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};


// Função para pegar um usuário por email (usada no login)
const buscarUsuarioPorEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};


// Função para criar um novo usuário
const criarUsuario = async ({name, email, password}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) return reject(err);

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function (err) {
        if (err) reject(err);
        else resolve({id: this.lastID, name, email});
      }
    );
  });
});
};

// Função para atualizar um usuário
const atualizarUsuario = (id, name, email, password = null) => {
  return new Promise((resolve, reject) => {
    if (password) {
      // Se for enviada nova senha, atualiza com hash
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return reject(err);

        db.run(
          'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
          [name, email, hashedPassword, id],
          function (err) {
            if (err) reject(err);
            else resolve({ id, name, email });
          }
        );
      });
    } else {
      // Atualiza apenas name e email
      db.run(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        function (err) {
          if (err) reject(err);
          else resolve({ id, name, email });
        }
      );
    }
  });
};

// Função para deletar um usuário
const deletarUsuario = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) reject(err);
      else resolve({ message: 'Usuário excluído com sucesso', changes: this.changes });
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
  deletarUsuario
};
