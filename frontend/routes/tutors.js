var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const url = "https://hq90rqnv-3000.brs.devtunnels.ms"

router.get('/', async function(req, res, next) {
  try {
    const productsResponse = await fetch(`${url}/products`);
    console.log('Status da resposta de produtos:', productsResponse.status);
    if (!productsResponse.ok) throw new Error('Erro ao buscar produtos');

    const products = await productsResponse.json();

    res.render('pages/tutors', { 
      title: 'Tutores'
    });
  } catch (error) {
    console.error('Erro ao carregar tutores:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;