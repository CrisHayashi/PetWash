const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  pegarTutores,
  pegarTutorPorId,
  criarTutor,
  atualizarTutor,
  apagarTutor
} = require('../model/tutors'); // importando as funções pegarTutor e pegarTutorPorId do arquivo tutorsModel.js

router.get('/', function (req, res, next) {
  pegarTutores(res, next);
});

router.get('/:id', function (req, res, next) {
  pegarTutorPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarTutor(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarTutor(req, res);
});

router.delete('/:id', (req, res) => {
  apagarTutor(req, res);
});

module.exports = router;