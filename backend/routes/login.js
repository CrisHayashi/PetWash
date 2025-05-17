const express = require('express');
const router = express.Router();

// Rota para servir a página de login
router.get('/login', (req, res) => {
  res.render('pages/login'); // Renderiza a página de login
});

module.exports = router;