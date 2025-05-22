var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('layout/layout', {
    title: 'Produtos',
    body: '../pages/products'
  });
});

module.exports = router;
