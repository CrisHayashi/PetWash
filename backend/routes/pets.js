const express = require('express');
const router = express.Router();
const petsController = require('../controllers/petscontroller');

router.get('/', petsController.listarPets);

router.get('/pagina', petsController.paginaPets);

router.get('/:id', petsController.buscarPetPorId);

router.post('/', petsController.criarPet);

router.patch('/:id', petsController.atualizarPet);

router.delete('/:id', petsController.deletarPet);

module.exports = router;