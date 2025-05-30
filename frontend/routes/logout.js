const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Se estiver usando sessão:
  req.session?.destroy?.();

  // Remove token do localStorage via frontend — já que ele é do navegador

  res.redirect('/login'); // Redireciona para tela de login
});

module.exports = router;