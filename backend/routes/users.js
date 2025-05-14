var express = require('express');
var router = express.Router();

// Importando o controller para usuários
const userscontroller = require('../controllers/userscontroller');

// GET - Listar todos os usuários

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     tags:
 *       - Usuários
 *     description: Retorna uma lista de todos os usuários cadastrados
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 */
router.get('/', userscontroller.listarUsuarios);

// GET - Pegar usuário por ID
router.get('/:id', userscontroller.buscarUsuarioPorId);

// POST - Criar um novo usuário

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Cria um novo usuário
 *    tags: [Usuários]
 *    description: Cria um novo usuário com os dados fornecidos
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 */
router.post('/', userscontroller.criarUsuario);

// PUT - Atualizar um usuário
router.put('/:id', userscontroller.atualizarUsuario);

// DELETE - Deletar um usuário
router.delete('/:id', userscontroller.deletarUsuario);

// POST - Login de usuário
router.post('/login', userscontroller.login);

module.exports = router;