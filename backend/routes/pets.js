const express = require('express');
const router = express.Router();
// const fs = require('fs');
const {
  listarPets,
  buscarPetPorId,
  criarPet,
  atualizarPet,
  deletarPet
} = require('../controllers/petscontroller'); // importando as funções pegarTutor e pegarTutorPorId do arquivo tutorsModel.js

router.get('/', function (req, res, next) {
  listarPets(req, res, next);
});

router.get('/:id', function (req, res, next) {
  buscarPetPorId(req, res, next);
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
  deletarPet(req, res, id);
});

module.exports = router;