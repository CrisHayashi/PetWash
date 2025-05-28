var express = require('express');
var router = express.Router();


router.get('/', async function (req, res, next) {
  try {
    console.log('URL_API:', process.env.URL_API);
    res.render('layout/layout', {
      title: 'Pedidos',
      body: '../pages/orders',
      URL_API: process.env.URL_API 
    });
  } catch (err) {
    console.error('Erro ao carregar a página de pedidos:', err.message);
    res.render('layout/layout', {
      title: 'Pedidos',
      body: '../pages/orders',
      URL_API: process.env.URL_API 
    });
  }
});

module.exports = router;
