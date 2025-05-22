var express = require('express');
var router = express.Router();
var url = process.env.URL_API


router.get('/', async function (req, res, next) {
  try {

    const productsResponse = await fetch(`${url}/products`);
    const products =  await productsResponse.json();

    console.log(products)

    res.render('layout/layout', {
      title: 'Produtos',
      body: '../pages/products',
      products : products
    });
  } catch (err) {
    console.log(err)
    res.status(500).send("Erro ao buscar produtos")
  }

});

module.exports = router;
