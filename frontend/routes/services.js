var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('layout/layout', { 
    body:'../pages/services', 
    title: 'Serviços' 
  });
});

module.exports = router;