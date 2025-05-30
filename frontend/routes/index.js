require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const url = process.env.URL_API || 'http://localhost:3000';

// Página inicial (carrega todos os dados e passa para o layout)
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
    console.error('Erro ao carregar dados da página inicial:', error.message);
    res.status(500).send('Erro interno ao carregar dados');
  }
});

module.exports = router;