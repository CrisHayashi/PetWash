const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  pegarPets,
  pegarPetPorId,
  criarPet,
  atualizarPet,
  apagarPet
} = require('../model/pets'); // importando as funções pegarTutor e pegarTutorPorId do arquivo tutorsModel.js

router.get('/', function (req, res, next) {
  pegarPets(res, next);
});

router.get('/:id', function (req, res, next) {
  pegarPetPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarPet(req, res);
});

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  atualizarPet(req, res, id);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id); // recebe o id (como string) do tutor a ser deletado e converte para numero
  apagarPet(req, res, id);
});

module.exports = router;