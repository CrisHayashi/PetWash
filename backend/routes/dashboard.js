const express = require('express');
const router = express.Router();
const dashboardscontroller = require('../controllers/dashboardscontroller');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Estatísticas gerais do sistema
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retorna estatísticas do sistema
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do dashboard retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEstoque:
 *                   type: integer
 *                   example: 120
 *                 totalServicos:
 *                   type: integer
 *                   example: 15
 *                 totalPedidos:
 *                   type: integer
 *                   example: 87
 *                 totalFaturado:
 *                   type: number
 *                   format: float
 *                   example: 15000.75
 *                 pedidosPorStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: finalizado
 *                       quantidade:
 *                         type: integer
 *                         example: 50
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro no servidor
 */



module.exports = router;