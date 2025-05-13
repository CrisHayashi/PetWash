var express = require('express');
var router = express.Router();

// Importando o controller para usuários
const userscontroller = require('../controllers/userscontroller');

// GET - Listar todos os usuários
router.get('/', userscontroller.listarUsuarios);

// GET - Pegar usuário por ID
router.get('/:id', userscontroller.buscarUsuarioPorId);

// POST - Criar um novo usuário
router.post('/', userscontroller.criarUsuario);

// PUT - Atualizar um usuário
router.put('/:id', userscontroller.atualizarUsuario);

// DELETE - Deletar um usuário
router.delete('/:id', userscontroller.deletarUsuario);

// POST - Login de usuário
router.post('/login', userscontroller.login);

module.exports = router;