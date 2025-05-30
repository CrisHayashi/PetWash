const express = require('express');
const router = express.Router();

// Página inicial
router.get('/', (req, res) => {
  res.render('index', { title: 'Bem-vindo ao PetShop' });
});

module.exports = router;
