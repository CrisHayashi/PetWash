require('dotenv').config();
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');  // importar node-fetch

var url = process.env.URL_API || 'http://localhost:3000'; // URL padrão caso não esteja definida no .env
//console.log('URL da API carregada do .env:', url); // Verificação

// Rota para a página inicial da aplicação
router.get('/', async (req, res) => {
  try {
    const endpoints = ['services', 'products', 'pets', 'tutors', 'orders'];
    const results = await Promise.all(
      endpoints.map(endpoint => fetch(`${url}/${endpoint}`))
    );

    const [servicesRes, productsRes, petsRes, tutorsRes, ordersRes] = results;

    if (!servicesRes.ok || !productsRes.ok || !petsRes.ok || !tutorsRes.ok || !ordersRes.ok) {
      throw new Error('Erro ao buscar dados de um ou mais endpoints');
    }

    const [services, products, pets, tutors, orders] = await Promise.all([
      servicesRes.json(),
      productsRes.json(),
      petsRes.json(),
      tutorsRes.json(),
      ordersRes.json()
    ]);

    //console.log("Pedidos carregados:", JSON.stringify(orders, null, 2));

    res.render('layout/layout', {
      title: 'Página Inicial',
      body: '../pages/index',
      services,
      products,
      pets,
      tutors,
      orders
    });

  } catch (error) {
    console.error('Erro ao carregar dados:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
