const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../.env' });

const gerarToken = (usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    name: usuario.name
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return token;
};

module.exports = gerarToken;