const express = require('express');
const router = express.Router();

const {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  deletarPedido
} = require('../controllers/orderscontroller');



/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     description: Retorna todos os pedidos cadastrados no sistema, incluindo tutor, pet, produtos e serviços.
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPedido:
 *                     type: integer
 *                   tutorName:
 *                     type: string
 *                   petName:
 *                     type: string
 *                   productNames:
 *                     type: string
 *                   quantidadeProduto:
 *                     type: integer
 *                   serviceNames:
 *                     type: string
 *                   quantidadeServico:
 *                     type: integer
 *                   total:
 *                     type: number
 *                   status:
 *                     type: string
 */
router.get('/', function (req, res, next) {
  listarPedidos(req, res, next);
});


/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtém um pedido específico
 *     tags: [Pedidos]
 *     description: Retorna os detalhes de um pedido pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPedido:
 *                     type: integer
 *                   tutorName:
 *                     type: string
 *                   petName:
 *                     type: string
 *                   productNames:
 *                     type: string
 *                   quantidade:
 *                     type: integer
 *                   total:
 *                     type: number
 *                   status:
 *                     type: string
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', function (req, res, next) {
  buscarPedidoPorId(req, res, next);
});



/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     description: Cria um novo pedido associando tutor, pet, produtos e serviços.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tutorId
 *               - petId
 *               - products
 *               - services
 *               - total
 *               - status
 *               - datetime
 *             properties:
 *               tutorId:
 *                 type: integer
 *               petId:
 *                 type: integer
 *               products:
 *                 type: array
 *                 items:
 *                   type: integer
 *               services:
 *                 type: array
 *                 items:
 *                   type: integer
 *               total:
 *                 type: number
 *               status:
 *                 type: string
 *               datetime:
 *                 type: string
 *                 format: date-time
 *           example:
 *             tutorId: 1
 *             petId: 2
 *             products: [1, 3]
 *             services: [2]
 *             total: 199.90
 *             status: "em andamento"
 *             datetime: "2025-05-16T10:00:00Z"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', (req, res) => {
  criarPedido(req, res);
});



/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Atualiza completamente um pedido existente
 *     tags: [Pedidos]
 *     description: Atualiza todos os dados de um pedido pelo ID. Substitui completamente os dados anteriores.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tutorId
 *               - petId
 *               - products
 *               - services
 *               - total
 *               - status
 *               - datetime
 *             properties:
 *               tutorId:
 *                 type: integer
 *               petId:
 *                 type: integer
 *               products:
 *                 type: array
 *                 items:
 *                   type: integer
 *               services:
 *                 type: array
 *                 items:
 *                   type: integer
 *               total:
 *                 type: number
 *               status:
 *                 type: string
 *               datetime:
 *                 type: string
 *                 format: date-time
 *           example:
 *             tutorId: 1
 *             petId: 3
 *             products: [2]
 *             services: [1, 4]
 *             total: 250.00
 *             status: "concluído"
 *             datetime: "2025-05-17T09:30:00Z"
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido não encontrado
 */
router.patch('/:id', (req, res) => {
  atualizarPedido(req, res);
});



/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Remove um pedido existente
 *     tags: [Pedidos]
 *     description: Exclui um pedido do sistema com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', (req, res) => {
  deletarPedido(req, res);
});

module.exports = router;