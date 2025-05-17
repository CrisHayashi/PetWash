const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado: Administradores apenas.' });
  }
  next();
};

module.exports = authorizeAdmin;