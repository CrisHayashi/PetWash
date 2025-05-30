require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const tempoExpiracao = process.env.JWT_EXPIRES_IN;

/**
 * Gera um token JWT com os dados públicos do usuário.
 * @param {Object} user - Objeto com id, name, email
 * @returns {string} token JWT assinado
 */
const gerarToken = ({ id, name, email }) => {
  const payload = { id, name, email };
  const options = { expiresIn: tempoExpiracao };

  return jwt.sign(payload, secret, options);
};

module.exports = gerarToken;
// Esse módulo deve ser usado após o login do usuário para gerar o token
