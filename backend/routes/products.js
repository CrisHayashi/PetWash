const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  pegarProdutos,
  pegarProdutoPorId,
  criarProduto,
  atualizarProduto,
  apagarProduto
} = require('../model/products');

router.get('/', function (req, res, next) {
  pegarProdutos(res, next);
});

router.get('/:id', function (req, res, next) {
  pegarProdutoPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarProduto(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarProduto(req, res);
});

router.delete('/:id', (req, res) => {
  apagarProduto(req, res);
});

module.exports = router;