var express = require('express');
var router = express.Router();
const tutorsController = require('../../backend/controllers/tutorscontroller');

var url = process.env.URL_API || 'http://localhost:3000';

router.get('/', async function (req, res, next) {
  try {
    // Faz a requisição para sua API para pegar os tutores
    const response = await fetch(url + "/tutors/");
    const tutors = await response.json();

    // Renderiza a página passando os tutores
    res.render('layout/layout', {
      title: 'Gestão de Tutores',
      body: '../pages/tutors', 
      scripts: '<script src="/js/tutors.js"></script>',
      tutors: tutors
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar tutores");
  }
});

module.exports = router;