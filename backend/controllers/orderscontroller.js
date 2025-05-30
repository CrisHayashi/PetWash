const ordersModel = require('../models/ordersModel');

const listarPedidos = async (req, res, next) => {
    try {
        const orders = await ordersModel.listarPedidos(); 
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

const buscarPedidoPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await ordersModel.buscarPedidoPorId(id); 
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
        const { tutorId, petId, products = [], services = [], status } = req.body;

        // Validações simples
        for (const prod of products) {
            if (!prod.productId || prod.prodQtd <= 0 || prod.prodPrice <= 0) {
                return res.status(400).json({ erro: 'Produto inválido. Verifique ID, quantidade e preço.' });
            }
        }
        for (const serv of services) {
            if (!serv.serviceId || serv.servQtd <= 0 || serv.servPrice <= 0) {
                return res.status(400).json({ erro: 'Serviço inválido. Verifique ID, quantidade e preço.' });
            }
        }

        const id = await ordersModel.criarPedido({ tutorId, petId, products, services, status }); 
        res.status(201).json({ mensagem: 'Pedido criado com sucesso', id });
    } catch (err) {
        next(err);
    }
};

const atualizarPedido = async (req, res, next) => {
    const { id } = req.params;
    try {
        const { tutorId, petId, products = [], services = [], status } = req.body;

        for (const prod of products) {
            if (!prod.productId || prod.prodQtd <= 0 || prod.prodPrice <= 0) {
                return res.status(400).json({ erro: 'Produto inválido. Verifique ID, quantidade e preço.' });
            }
        }
        for (const serv of services) {
            if (!serv.serviceId || serv.servQtd <= 0 || serv.servPrice <= 0) {
                return res.status(400).json({ erro: 'Serviço inválido. Verifique ID, quantidade e preço.' });
            }
        }

        await ordersModel.atualizarPedido(id, { tutorId, petId, products, services, status });
        res.json({ mensagem: 'Pedido atualizado com sucesso', id });
    } catch (err) {
        next(err);
    }
};

const deletarPedido = async (req, res, next) => {
    const { id } = req.params;
    try {
        await ordersModel.deletarPedido(id);
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
