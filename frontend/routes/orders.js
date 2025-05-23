var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('layout/layout', {
    title: 'Express',  // Passando o title corretamente para o layout
    body: '../pages/orders'  // Passando a página dinâmica
  });
});

module.exports = router;