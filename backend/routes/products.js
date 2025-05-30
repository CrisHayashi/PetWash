const express = require('express');
const router = express.Router();

// Importando o controller para produtos
const productscontroller = require('../controllers/productscontroller');

// GET - Listar todos os produtos
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     description: Retorna uma lista com todos os produtos cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
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
 *                   price:
 *                     type: integer
 *                   category:
 *                     type: string
 *                   stock:
 *                     type: integer
 */
router.get('/', productscontroller.listarProdutos);


// GET - Pegar produto por ID
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtém um produto específico
 *     tags: [Produtos]
 *     description: Retorna os dados de um produto com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do produto retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 price:
 *                   type: integer
 *                 category:
 *                   type: string
 *                 stock:
 *                   type: integer
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', productscontroller.buscarProdutoPorId);


// POST - Criar um novo produto
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     description: Adiciona um novo produto ao sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos enviados na requisição
 */
router.post('/', productscontroller.criarProduto);


// PATCH - Atualizar parcialmente um produto existente
/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um produto existente
 *     tags: [Produtos]
 *     description: Atualiza apenas os campos fornecidos de um produto com base no ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 */
router.patch('/:id', productscontroller.atualizarProdutoParcial);


// PUT - Atualizar um produto existente
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza completamente um produto existente
 *     tags: [Produtos]
 *     description: Substitui todos os dados de um produto pelo conteúdo fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser atualizado
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
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', productscontroller.atualizarProdutoCompleto);


// DELETE - Deletar um produto
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto existente
 *     tags: [Produtos]
 *     description: Remove um produto do sistema com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 */

router.delete('/:id', productscontroller.deletarProduto);


// Exportando o router para ser utilizado em outros arquivos
module.exports = router;