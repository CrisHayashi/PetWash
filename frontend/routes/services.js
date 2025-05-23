var express = require('express');
var router = express.Router();
var url = process.env.URL_API


router.get('/', async function(req, res, next) {
  try {

    const servicesResponse =  await fetch(`${url}/services`);
    const services =  await servicesResponse.json();

    res.render('layout/layout', { 
    body:'../pages/services', 
    title: 'Serviços' ,
    services : services
  });
  } catch (err) {
    console.log(err)
    res.status(500).send("Erro ao buscar serviços")
  }

  
});

module.exports = router;