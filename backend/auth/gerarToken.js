require('dotenv').config();
const jwt = require('jsonwebtoken');

const gerarToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role, // Adicionando o papel do usuário
  };

  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
};

module.exports = gerarToken;