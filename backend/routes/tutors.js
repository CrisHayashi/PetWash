const express = require('express');
const router = express.Router();
// const fs = require('fs');

const {
  listarTutores,
  buscarTutorPorId,
  criarTutor,
  atualizarTutor,
  deletarTutor
} = require('../controllers/tutorscontroller'); // importando as funções pegarTutor e pegarTutorPorId do arquivo tutorsModel.js

router.get('/', function (req, res, next) {
  listarTutores(res, next);
});

router.get('/:id', function (req, res, next) {
  buscarTutorPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarTutor(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarTutor(req, res);
});

router.delete('/:id', (req, res) => {
  deletarTutor(req, res);
});

module.exports = router;