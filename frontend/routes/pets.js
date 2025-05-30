const express = require('express');
const router = express.Router();
require('dotenv').config();
const fetch = require('node-fetch');

const url = process.env.URL_API || 'http://localhost:3000';

router.get('/', async function (req, res) {
  try {
    // 🔄 Busca pets e tutores em paralelo
    const [petsRes, tutorsRes] = await Promise.all([
      fetch(`${url}/pets`),
      fetch(`${url}/tutors`)
    ]);

    if (!petsRes.ok || !tutorsRes.ok) {
      throw new Error('Erro ao buscar dados dos pets ou tutores');
    }

    const pets = await petsRes.json();
    const tutors = await tutorsRes.json();

    // ✅ Renderiza com os dois dados
    res.render('layout/layout', {
      title: 'Gestão de Pets',
      body: '../pages/pets',
      pets,
      tutors
    });

  } catch (err) {
    console.error('Erro ao carregar a página de pets:', err.message);
    res.status(500).render('layout/layout', {
      title: 'Erro',
      body: '../pages/pets',
      pets: [],
      tutors: []
    });
  }
});

module.exports = router;