var express = require('express');
var router = express.Router();
const gerarToken = require('../auth/gerarToken');
const authenticateToken = require('../auth/authenticateToken');

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
router.get('/', authenticateToken, userscontroller.listarUsuarios);

// GET - Pegar usuário por ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário específico por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authenticateToken, userscontroller.buscarUsuarioPorId);

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
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', authenticateToken, userscontroller.atualizarUsuario);

// DELETE - Deletar um usuário
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authenticateToken, userscontroller.deletarUsuario);

// POST - Login de usuário
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', userscontroller.login);

module.exports = router;