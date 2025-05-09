const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  pegarPedidos,
  pegarPedidoPorId,
  criarPedido,
  atualizarPedido,
  apagarPedido
} = require('../model/orders');

router.get('/', function (req, res, next) {
  pegarPedidos(res, next);
});

router.get('/:id', function (req, res, next) {
  pegarPedidoPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarPedido(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarPedido(req, res);
});

router.delete('/:id', (req, res) => {
  apagarPedido(req, res);
});

module.exports = router;