require('dotenv').config();
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');  // importar node-fetch

var url = process.env.URL_API;
console.log('URL da API carregada do .env:', url); // Verificação

// Rota para a página inicial da aplicação
router.get('/', async (req, res) => {
  try {
    // Fazendo fetch para os serviços da API DO BACKEND
    const servicesResponse = await fetch(`${url}/services`);
      console.log('Status da resposta de serviços:', servicesResponse.status);
    if (!servicesResponse.ok) throw new Error('Erro ao buscar serviços');
    const services = await servicesResponse.json();

    // Fazendo fetch para os produtos da API
    const productsResponse = await fetch(`${url}/products`);
    console.log('Status da resposta de produtos:', productsResponse.status);
    if (!productsResponse.ok) throw new Error('Erro ao buscar produtos');
    const products = await productsResponse.json();


    res.render('pages/index', {
      title: 'Página Inicial',
      services,
      products
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para carregar os partials dinamicamente
router.get('/partials/:name', (req, res) => {
  const partial = req.params.name;
  res.render(`partials/${partial}`);
});



module.exports = router;
