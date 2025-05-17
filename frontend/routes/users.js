var express = require('express');
var router = express.Router();
const url = "https://super-duper-garbanzo-976x6w559wg627rj9-3000.app.github.dev/users";


/* GET users listing. */
router.get('/', function(req, res, next) {

  fetch(url, { method: 'GET'})
    .then(res => res.json())
    .then(data => {
      res.render('layout', { body:'pages/users', title: 'Gestao de usuarios', users: data });
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    });
  
});

module.exports = router;
