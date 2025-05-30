var express = require('express');
var router = express.Router();
const url = process.env.URL_API;


/* GET users listing. */
router.get('/', function(req, res, next) {

  fetch(url, { method: 'GET'})
    .then(res => res.json())
    .then(data => {
      res.render('layout/layout', { body:'pages/users', title: 'Gestao de usuarios', users: data });
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    });
  
});

module.exports = router;
