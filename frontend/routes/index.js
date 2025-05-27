require('dotenv').config();
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');  // importar node-fetch

var url = process.env.URL_API || 'http://localhost:3000'; // URL padrão caso não esteja definida no .env
console.log('URL da API carregada do .env:', url); // Verificação

// Rota para a página inicial da aplicação
router.get('/', async (req, res) => {
  try {
    const endpoints = ['services', 'products', 'pets', 'tutors', 'orders'];
    const results = await Promise.all(
      endpoints.map(endpoint => fetch(`${url}/${endpoint}`))
    );

    const [servicesRes, productsRes, petsRes, tutoresRes, pedidosRes] = results;

    if (!servicesRes.ok || !productsRes.ok || !petsRes.ok || !tutoresRes.ok || !pedidosRes.ok) {
      throw new Error('Erro ao buscar dados de um ou mais endpoints');
    }

    const [services, products, pets, tutores, pedidos] = await Promise.all([
      servicesRes.json(),
      productsRes.json(),
      petsRes.json(),
      tutoresRes.json(),
      pedidosRes.json()
    ]);

    res.render('layout/layout', {
      title: 'Página Inicial',
      body: '../pages/index',
      services,
      products,
      pets,
      tutors: tutores,
      orders: pedidos
    });

  } catch (error) {
    console.error('Erro ao carregar dados:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
