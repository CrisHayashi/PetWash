const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  pegarServicos,
  pegarServicoPorId,
  criarServico,
  atualizarServico,
  apagarServico
} = require('../model/services');

router.get('/', function (req, res, next) {
  pegarServicos(res, next);
});

router.get('/:id', function (req, res, next) {
  pegarServicoPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarServico(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarServico(req, res);
});

router.delete('/:id', (req, res) => {
  apagarServico(req, res);
});

module.exports = router;