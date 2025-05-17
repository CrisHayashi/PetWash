var express = require('express');
var router = express.Router();
const petsController = require('../../backend/controllers/petscontroller');

var url = process.env.URL_API || 'http://localhost:3000';

router.get('/', async function(req, res, next) {
  try {
    // Faz a requisição para sua API para pegar os pets
    const response = await fetch(url + "/pets/");
    const pets = await response.json();

    // Renderiza a página passando os pets
    res.render('layout/layout', {
      title: 'Gestão de Pets',
      body: 'pages/pets',
      pets: pets
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar pets");
  }
});

module.exports = router;