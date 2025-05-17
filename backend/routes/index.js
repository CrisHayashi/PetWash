var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ message: 'Bem vindo a API PetWash!' });
});

router.get('/partials/:name', (req, res, next) => {
  const name = req.params.name;
  const filePath = path.join(__dirname, '../views/partials', `${name}.ejs`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return next(); // se o arquivo não existir, vai para o 404
    res.render(`partials/${name}`);
  });
});

module.exports = router;
