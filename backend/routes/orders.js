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
 * tags:
 *   name: Pedidos
 *   description: Gerenciamento de pedidos de serviços e produtos
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
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
 *                   id:
 *                     type: integer
 *                   tutorId:
 *                     type: integer
 *                   petId:
 *                     type: integer
 *                   total:
 *                     type: number
 *                   status:
 *                     type: string
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: integer
 *                         productName:
 *                           type: string
 *                         prodQtd:
 *                           type: integer
 *                         prodPrice:
 *                           type: number
 *                         prodTotal:
 *                           type: number
 *                   services:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         serviceId:
 *                           type: integer
 *                         serviceName:
 *                           type: string
 *                         servQtd:
 *                           type: integer
 *                         servPrice:
 *                           type: number
 *                         servTotal:
 *                           type: number
 */
router.get('/', listarPedidos);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 tutorId:
 *                   type: integer
 *                 petId:
 *                   type: integer
 *                 total:
 *                   type: number
 *                 status:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                       productName:
 *                         type: string
 *                       prodQtd:
 *                         type: integer
 *                       prodPrice:
 *                         type: number
 *                       prodTotal:
 *                         type: number
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       serviceId:
 *                         type: integer
 *                       serviceName:
 *                         type: string
 *                       servQtd:
 *                         type: integer
 *                       servPrice:
 *                         type: number
 *                       servTotal:
 *                         type: number
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
 *               - status
 *             properties:
 *               tutorId:
 *                 type: integer
 *               petId:
 *                 type: integer
 *               status:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - prodQtd
 *                     - prodPrice
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     prodQtd:
 *                       type: integer
 *                     prodPrice:
 *                       type: number
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - serviceId
 *                     - servQtd
 *                     - servPrice
 *                   properties:
 *                     serviceId:
 *                       type: integer
 *                     servQtd:
 *                       type: integer
 *                     servPrice:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 id:
 *                   type: integer
 *       400:
 *         description: Dados inválidos
 */
router.post('/', criarPedido);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
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
 *               status:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     prodQtd:
 *                       type: integer
 *                     prodPrice:
 *                       type: number
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: integer
 *                     servQtd:
 *                       type: integer
 *                     servPrice:
 *                       type: number
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
 *     summary: Remove um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido a ser removido
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', deletarPedido);

module.exports = router;