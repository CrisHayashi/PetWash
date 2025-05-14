var express = require('express');
var router = express.Router();

// Importando o controller para tutores
const tutorscontroller = require('../controllers/tutorscontroller');


// GET - Listar todos os tutores
/**
 * @swagger
 * /tutors:
 *   get:
 *     summary: Lista todos os tutores
 *     tags: [Tutores]
 *     description: Retorna uma lista com todos os tutores cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de tutores retornada com sucesso
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
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 */

router.get('/', tutorscontroller.listarTutores);

// GET - Pegar tutor por ID
/**
 * @swagger
 * /tutors/{id}:
 *   get:
 *     summary: Obtém um tutor específico
 *     tags: [Tutores]
 *     description: Retorna os dados de um tutor com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tutor a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do tutor retornados com sucesso
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
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *       404:
 *         description: Tutor não encontrado
 */

router.get('/:id', tutorscontroller.buscarTutorPorId);

// POST - Criar um novo tutor
/**
 * @swagger
 * /tutors:
 *   post:
 *     summary: Cria um novo tutor
 *     tags: [Tutores]
 *     description: Cadastra um novo tutor no sistema com os dados fornecidos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *           example:
 *             name: "Ana Maria"
 *             email: "ana.maria@exemplo.com"
 *             phone: "(11) 97777-6666"
 *             address: "Rua Flor de Lis, 45"
 *     responses:
 *       201:
 *         description: Tutor criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

router.post('/', tutorscontroller.criarTutor);

/**
 * @swagger
 * /tutors/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um tutor existente
 *     tags:
 *       - Tutores
 *     description: Atualiza um ou mais campos de um tutor existente com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tutor a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *           example:
 *             email: "novoemail@exemplo.com"
 *             phone: "(11) 90000-0000"
 *     responses:
 *       200:
 *         description: Tutor atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Tutor não encontrado
 */
router.patch('/:id', tutorscontroller.atualizarTutorParcial);

// PUT - Atualizar um tutor existente
/**
 * @swagger
 * /tutors/{id}:
 *   put:
 *     summary: Atualiza completamente um tutor existente
 *     tags: [Tutores]
 *     description: Atualiza todos os dados de um tutor com base no ID fornecido. Todos os campos devem ser informados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tutor a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *           example:
 *             name: "Joana da Silva"
 *             email: "joana.silva@exemplo.com"
 *             phone: "(11) 98888-7777"
 *             address: "Rua das Acácias, 123"
 *     responses:
 *       200:
 *         description: Tutor atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Tutor não encontrado
 */

router.put('/:id', tutorscontroller.atualizarTutorCompleto);

// DELETE - Deletar um tutor
/**
 * @swagger
 * /tutors/{id}:
 *   delete:
 *     summary: Remove um tutor existente
 *     tags: [Tutores]
 *     description: Exclui um tutor do sistema com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tutor a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutor removido com sucesso
 *       404:
 *         description: Tutor não encontrado
 */

router.delete('/:id', tutorscontroller.deletarTutor);

// Exportando o router para ser utilizado em outros arquivos
module.exports = router;