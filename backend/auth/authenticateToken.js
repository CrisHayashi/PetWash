require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Middleware que protege rotas verificando o token JWT no cabeçalho Authorization.
 * O token deve estar no formato "Bearer <token>"
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }

    // Se válido, adiciona os dados do usuário à request
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
// Esse middleware deve ser usado nas rotas que precisam de autenticação