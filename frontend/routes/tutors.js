var express = require('express');
var router = express.Router();
var url = process.env.URL_API

router.get('/', async function (req, res, next) {
  try {
    // Fazendo fetch para os tutores da API
    const tutorsResponse = await fetch(`${url}/tutors`);
    const tutors = await tutorsResponse.json();

    console.log(tutors)

    res.render('layout/layout', {
      title: 'Tutores',
      body: '../pages/tutors',
      tutors : tutors
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar tutors")
  }


});

module.exports = router;