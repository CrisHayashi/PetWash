const express = require('express');
const router = express.Router();
const authenticateToken = require('../auth/authenticateToken');

const {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  deletarPedido
} = require('../controllers/orderscontroller');

router.get('/', authenticateToken, listarPedidos);
router.get('/:id', authenticateToken, buscarPedidoPorId);
router.post('/', authenticateToken, criarPedido);
router.patch('/:id', authenticateToken, atualizarPedido);
router.delete('/:id', authenticateToken, deletarPedido);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     description: Retorna todos os pedidos cadastrados no sistema, incluindo tutor, pet, produtos e serviços.
 *     security:
 *       - bearerAuth: []
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
router.get('/', authenticateToken, listarPedidos);


/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtém um pedido específico
 *     tags: [Pedidos]
 *     description: Retorna os detalhes de um pedido pelo ID.
 *     security:
 *       - bearerAuth: []
 * 
 *      parameters:
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
 *                   quantidadeProduto:
 *                     type: integer
 *                 serviceNames:
 *                    type: string
 *                  quantidadeServico:
 *                    type: integer
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
 *     tags:
 *       - Pedidos
 *     description: Cria um pedido associando tutor, pet, produtos e serviços com quantidade e preço.
 *     security:
 *       - bearerAuth: []
 *      requestBody:
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
 *                 description: ID do tutor do pet
 *               petId:
 *                 type: integer
 *                 description: ID do pet
 *               products:
 *                 type: array
 *                 description: Lista de produtos com quantidade e preço
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - prodQtd
 *                     - prodPrice
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID do produto
 *                     prodQtd:
 *                       type: integer
 *                       description: Quantidade do produto
 *                     prodPrice:
 *                       type: number
 *                       format: float
 *                       description: Preço unitário do produto
 *               services:
 *                 type: array
 *                 description: Lista de serviços com quantidade e preço
 *                 items:
 *                   type: object
 *                   required:
 *                     - serviceId
 *                     - servQtd
 *                     - servPrice
 *                   properties:
 *                     serviceId:
 *                       type: integer
 *                       description: ID do serviço
 *                     servQtd:
 *                       type: integer
 *                       description: Quantidade do serviço
 *                     servPrice:
 *                       type: number
 *                       format: float
 *                       description: Preço unitário do serviço
 *               status:
 *                 type: string
 *                 description: Status do pedido
 *             example:
 *               tutorId: 1
 *               petId: 3
 *               products:
 *                 - productId: 1
 *                   prodQtd: 2
 *                   prodPrice: 29.90
 *                 - productId: 6
 *                   prodQtd: 1
 *                   prodPrice: 129.90
 *               services:
 *                 - serviceId: 1
 *                   servQtd: 1
 *                   servPrice: 44.90
 *               status: "em andamento"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                   description: ID do pedido criado
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
 *     description: Atualiza dados do pedido, incluindo produtos, serviços, tutor, pet e status.
 *     security:
 *       - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: ID do pedido a ser atualizado
 *         required: true
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
 *                       format: float
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
 *                       format: float
 *               status:
 *                 type: string
 *             example:
 *               tutorId: 1
 *               petId: 3
 *               products:
 *                 - productId: 2
 *                   prodQtd: 1
 *                   prodPrice: 12.00
 *               services:
 *                 - serviceId: 1
 *                   servQtd: 2
 *                   servPrice: 30.00
 *                 - serviceId: 4
 *                   servQtd: 1
 *                   servPrice: 45.00
 *               status: "concluído"
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
 *     security:
 *       - bearerAuth: []
 *      parameters:
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