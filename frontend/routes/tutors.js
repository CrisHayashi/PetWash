var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const url = "https://hq90rqnv-3000.brs.devtunnels.ms"

router.get("/tutores", (req, res) => {
  res.render("pages/tutors");
});

module.exports = router;