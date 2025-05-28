var express = require('express');
var router = express.Router();
const petsController = require('../../backend/controllers/petscontroller');

var url = process.env.URL_API || 'http://localhost:3000';

router.get('/', async function (req, res) {
  try {
    // Faz a requisição para a API de pedidos
    const response = await fetch(`${url}/orders`);
    const orders = await response.json();

    // Renderiza a página, passando os pedidos para a view
    res.render('layout/layout', {
      title: 'Gestão de Pedidos',
      body: '../pages/orders',
      orders: orders
    });
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.render('layout/layout', {
      title: 'Gestão de Pedidos',
      body: '../pages/orders',
      orders: []
    });
  }
});

module.exports = router;