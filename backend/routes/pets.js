const express = require('express');
const router = express.Router();

// Importando o controller para pets
const petsController = require('../controllers/petscontroller');

/// GET - Listar todos os pets
/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista todos os pets
 *     tags: [Pets]
 *     description: Retorna uma lista com todos os pets cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de pets retornada com sucesso
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
 *                   species:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   tutorId:
 *                     type: integer
 */
router.get('/', petsController.listarPets);

// GET - Página de pets (ex: paginada ou custom)
 /**
  * @swagger
  * /pets/pagina:
  *   get:
  *     summary: Retorna página de pets (paginada ou funcionalidade específica)
  *     tags: [Pets]
  *     responses:
  *       200:
  *         description: Página de pets retornada com sucesso
  */
router.get('/pagina', petsController.paginaPets);


// GET - Buscar pet por ID
/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Obtém um pet especifico
 *     tags: [Pets]
 *     description: Retorna os dados de um pet com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do pet retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 species:
 *                   type: string
 *                 breed:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 tutorId:
 *                   type: integer
 *       404:
 *         description: Pet não encontrado
 */
router.get('/:id', petsController.buscarPetPorId);


// POST - Criar um novo pet
/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Cria um novo pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *               - age
 *               - tutorId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Toby"
 *               species:
 *                 type: string
 *                 example: "Cachorro"
 *               breed:
 *                 type: string
 *                 example: "Poodle"
 *               age:
 *                 type: integer
 *                 example: 3
 *               tutorId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Pet criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Pet criado com sucesso"
 *                 petId:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Dados inválidos
 */
router.post('/', petsController.criarPet);


// PATCH - Atualizar parcialmente um pet existente
/**
 * @swagger
 * /pets/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um pet existente
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser atualizado
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
 *                 example: "Toby"
 *               species:
 *                 type: string
 *                 example: "Gato"
 *               breed:
 *                 type: string
 *                 example: "Siamês"
 *               age:
 *                 type: integer
 *                 example: 4
 *               tutorId:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pet não encontrado
 */
router.patch('/:id', petsController.atualizarPet);


// DELETE - Deletar um pet pelo ID
/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Deleta um pet existente
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet deletado com sucesso
 *       404:
 *         description: Pet não encontrado
 */
router.delete('/:id', petsController.deletarPet);

module.exports = router;