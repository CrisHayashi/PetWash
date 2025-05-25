var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) { // tela para fazer o login
  res.render('layout/layout', { 
    body:'../pages/login', 
    title: 'PetShop' 
});
});

module.exports = router;