require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const tempoExpiracao = process.env.JWT_EXPIRES_IN

/**
 * Gera um token JWT com os dados públicos do usuário.
 * @param {Object} user - Objeto do usuário com id, name, email.
 * @returns {string} Token JWT assinado.
 */
const gerarToken = ({ id, name, email }) => {
  const payload = { id, name, email };
  const options = { expiresIn: tempoExpiracao };

  return jwt.sign(payload, secret, options);
};

module.exports = gerarToken;