const fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
<<<<<<< HEAD
const fetch = require('node-fetch');
const url = "https://hq90rqnv-3000.brs.devtunnels.ms"

router.get("/tutores", (req, res) => {
  res.render("pages/tutors");
=======
var url = process.env.URL_API

router.get('/tutors', async function (req, res, next) {
  try {
    // Fazendo fetch para os tutores da API
    const tutorsResponse = await fetch(`${url}/tutors`);
    const tutors = await tutorsResponse.json();

    console.log(tutors);

    res.render('layout/layout', {
      title: 'Tutores',
      body: 'pages/tutors',
      tutors : tutors
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar tutors")
  }
>>>>>>> main
});

module.exports = router;