const express = require('express');
const router = express.Router();

// Importando o controller para serviços
const servicescontroller = require('../controllers/servicescontroller');

// GET - Listar todos os serviços
/**
 * @swagger
 * /services:
 *   get:
 *     summary: Lista todos os serviços
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example:
 *                   name:
 *                     type: string
 *                     example: "Banho"
 *                   price:
 *                     type: number
 *                     example: 49.90
 *                   description:
 *                     type: string
 *                     example: "Banho completo com shampoo e secagem."
 */

router.get('/', servicescontroller.listarServicos);

// GET - Buscar serviço por ID
/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Obtém um serviço específico
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do serviço a ser consultado
 *     responses:
 *       200:
 *         description: Dados do serviço retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example:
 *                 name:
 *                   type: string
 *                   example: "Consulta veterinária"
 *                 price:
 *                   type: number
 *                   example: 120.00
 *                 description:
 *                   type: string
 *                   example: "Avaliação completa pelo veterinário."
 *       404:
 *         description: Serviço não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Serviço não encontrado"
 */
router.get('/:id', servicescontroller.buscarServicoPorId);

// POST - Criar um novo serviço
/**
 * @swagger
 * /services:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tosa"
 *               price:
 *                 type: number
 *                 example: 39.90
 *               description:
 *                 type: string
 *                 example: "Tosa completa e higienização."
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Servico criado com sucesso"
 *                 serviceId:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Dados inválidos
 */

router.post('/', servicescontroller.criarServico);

// PATCH - Atualizar um serviço existente
/**
 * @swagger
 * /services/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um serviço
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do serviço a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tosa"
 *               price:
 *                 type: number
 *                 example: 39.90
 *               description:
 *                 type: string
 *                 example: "Tosa completa e higienização."
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Serviço atualizado com sucesso"
 *       404:
 *         description: Serviço não encontrado
 *       400:
 *         description: Dados inválidos
 */

router.patch('/:id', servicescontroller.atualizarServicoParcial);

// PUT - Atualizar um serviço existente (substituição total)
/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Atualiza completamente um serviço
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do serviço a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tosa"
 *               price:
 *                 type: number
 *                 example: 150
 *               description:
 *                 type: string
 *                 example: "Tosa para animais de pequeno porte."
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       404:
 *         description: Serviço não encontrado
 *       400:
 *         description: Dados inválidos
 */

router.put('/:id', servicescontroller.atualizarServicoCompleto);

// DELETE - Deletar um serviço existente
/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Remove um serviço existente
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do serviço a ser deletado
 *     responses:
 *       200:
 *         description: Serviço deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Serviço removido com sucesso"
 *       404:
 *         description: Serviço não encontrado
 */

router.delete('/:id', servicescontroller.deletarServico);

module.exports = router;