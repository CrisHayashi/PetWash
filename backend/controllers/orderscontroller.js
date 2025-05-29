const ordersModel = require('../model/ordersModel');

const listarPedidos = async (req, res, next) => {
    try {
        const orders = await ordersModel.listarPedidos();
        console.log("Exemplo de pedido:", JSON.stringify(orders[0], null, 2)); 
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
        const { tutorId, petId, products = [], services = [], status, total: totalEnviado } = req.body;

        // Função para calcular o total do pedido
        const id = await ordersModel.criarPedido({
            tutorId,
            petId,
            products,
            services,
            status,
        }); 
        res.status(201).json({ mensagem: 'Pedido criado com sucesso', id });
    } catch (err) {
        next(err);
    }
};

const atualizarPedido = async (req, res, next) => {
    const { id } = req.params;
    try {
        const { tutorId, petId, products = [], services = [], status, total: totalEnviado } = req.body;
      
        await ordersModel.atualizarPedido(id, { 
            tutorId,
            petId,
            products,
            services,
            status,
        });

        res.json({ mensagem: 'Pedido atualizado com sucesso', id });

    } catch (err) {
        console.error('Erro ao atualizar pedido:', err);
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