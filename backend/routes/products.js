const express = require('express');
const router = express.Router();
// const productsController = require('../controllers/productscontroller');

// const fs = require('fs');
const {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
} = require('../controllers/productscontroller');

router.get('/', function (req, res, next) {
  listarProdutos(res, next);
});

router.get('/:id', function (req, res, next) {
  buscarProdutoPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarProduto(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarProduto(req, res);
});

router.delete('/:id', (req, res) => {
  deletarProduto(req, res);
});

module.exports = router;