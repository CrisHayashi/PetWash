// Carrega variáveis do .env
require('dotenv').config();

// Importa dependências necessárias
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // <--- IMPORTANTE!!

// URL da API vinda do .env
const url = process.env.URL_API;

router.get('/', async function (req, res) {
  try {
    // Busca os serviços no backend
    const servicesResponse = await fetch(`${url}/services`);

    // Trata erro de resposta não-OK
    if (!servicesResponse.ok) {
      throw new Error(`Erro na resposta da API: ${servicesResponse.status}`);
    }

    const services = await servicesResponse.json();

    // Renderiza a view passando os dados
    res.render('layout/layout', {
      body: '../pages/services',
      title: 'Serviços',
      services: services
    });
  } catch (err) {
    console.error('Erro em /services:', err.message);
    res.status(500).send("Erro ao buscar serviços");
  }
});

module.exports = router;