const express = require('express');
const router = express.Router();

const {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  deletarPedido
} = require('../controllers/orderscontroller');

router.get('/', function (req, res, next) {
  listarPedidos(req, res, next);
});

router.get('/:id', function (req, res, next) {
  buscarPedidoPorId(req, res, next);
});

router.post('/', (req, res) => {
  criarPedido(req, res);
});

router.patch('/:id', (req, res) => {
  atualizarPedido(req, res);
});

router.delete('/:id', (req, res) => {
  deletarPedido(req, res);
});

module.exports = router;