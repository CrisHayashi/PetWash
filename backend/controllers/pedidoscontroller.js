const orderModel = require('../models/order');

const listarPedidos = async (req, res, next) => {
    try {
        const pedidos = await orderModel.pegarPedidos();  // Chama a função do modelo
        res.json(pedidos);
    } catch (err) {
        next(err);
    }
};

const buscarPedidoPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pedido = await orderModel.pegarPedidoPorId(id);  // Chama a função do modelo
        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        res.json(pedido);
    } catch (err) {
        next(err);
    }
};

const criarPedido = async (req, res, next) => {
    try {
        const pedidoId = await orderModel.criarPedido(req.body);  // Chama a função do modelo
        res.status(201).json({ mensagem: 'Pedido criado com sucesso', pedidoId });
    } catch (err) {
        next(err);
    }
};

const atualizarPedido = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pedidoId = await orderModel.atualizarPedido(id, req.body);  // Chama a função do modelo
        res.json({ mensagem: 'Pedido atualizado com sucesso', pedidoId });
    } catch (err) {
        next(err);
    }
};

const deletarPedido = async (req, res, next) => {
    const { id } = req.params;
    try {
        await orderModel.apagarPedido(id);  // Chama a função do modelo
        res.json({ mensagem: 'Pedido removido com sucesso' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listarPedidos,
    buscarPedidoPorId,
    criarPedido,
    atualizarPedido,
    deletarPedido
};