const ordersModel = require('../model/ordersModel');

const listarPedidos = async (req, res, next) => {
    try {
        const orders = await ordersModel.listarPedidos();  // Chama a função do modelo
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

const buscarPedidoPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await ordersModel.buscarPedidoPorId(id);  // Chama a função do modelo
        if (!order) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        res.json(order);
    } catch (err) {
        next(err);
    }
};

const criarPedido = async (req, res, next) => {
    try {
        const orderId = await ordersModel.criarPedido(req.body);  // Chama a função do modelo
        res.status(201).json({ mensagem: 'Pedido criado com sucesso', orderId });
    } catch (err) {
        next(err);
    }
};

const atualizarPedido = async (req, res, next) => {
    const { id } = req.params;
    try {
        const orderId = await ordersModel.atualizarPedido(id, req.body);  // Chama a função do modelo
        res.json({ mensagem: 'Pedido atualizado com sucesso', orderId });
    } catch (err) {
        next(err);
    }
};

const deletarPedido = async (req, res, next) => {
    const { id } = req.params;
    try {
        await ordersModel.deletarPedido(id);  // Chama a função do modelo
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