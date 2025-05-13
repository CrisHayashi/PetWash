const express = require('express');
const router = express.Router();
// const fs = require('fs');

const {
  listarServicos,
  buscarServicoPorId,
  criarServico,
  atualizarServico,
  deletarServico
} = require('../controllers/servicescontroller');

router.get('/', function (req, res, next) {
  listarServicos(req, res, next);
});

router.get('/:id', function (req, res, next) {
  buscarServicoPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarServico(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarServico(req, res);
});

router.delete('/:id', (req, res) => {
  deletarServico(req, res);
});

module.exports = router;