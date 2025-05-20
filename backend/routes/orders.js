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
router.get('/', listarPedidos);


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
router.get('/:id', buscarPedidoPorId);



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
 *           example:
 *             tutorId: 1
 *             petId: 2
 *             products: [1, 3]
 *             services: [2]
 *             total: 199.90
 *             status: "em andamento"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', criarPedido);



/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um pedido existente
 *     tags: [Pedidos]
 *     description: Atualiza os dados solicitados de um pedido pelo ID. Substitui parcialmente os dados anteriores.
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
 *           example:
 *             tutorId: 1
 *             petId: 3
 *             products: [2]
 *             services: [1, 4]
 *             total: 250.00
 *             status: "concluído"
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido não encontrado
 */
router.patch('/:id', atualizarPedido);



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
router.delete('/:id', deletarPedido);

module.exports = router;