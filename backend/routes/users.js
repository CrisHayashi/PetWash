var express = require('express');
var router = express.Router();

// Importando o controller para usuários
const usersController = require('../controllers/usersController');

// GET - Listar todos os usuários
router.get('/', usersController.pegarUsuarios);

// GET - Pegar usuário por ID
router.get('/:id', usersController.pegarUsuarioPorId);

// POST - Criar um novo usuário
router.post('/', usersController.criarUsuario);

// PUT - Atualizar um usuário
router.put('/:id', usersController.atualizarUsuario);

// DELETE - Deletar um usuário
router.delete('/:id', usersController.deletarUsuario);

module.exports = router;