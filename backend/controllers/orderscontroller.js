const ordersModel = require('../model/ordersModel');

const calcularTotalPedido = async (products, services) => {
    const totalProdutos = await ordersModel.calcularTotalProdutos(products);
    const totalServicos = await ordersModel.calcularTotalServicos(services);
    return totalProdutos + totalServicos;
};

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
        const { tutorId, petId, products = [], services = [], status, total: totalEnviado } = req.body;

        /const totalCalculado = await calcularTotalPedido(products, services);

        // Verifica se o total enviado é igual ao total calculado
        if (totalEnviado !== undefined && Math.abs(totalCalculado - totalEnviado) > 0.05) {
            return res.status(400).json({
                erro: 'Total inconsistente com a soma realizada internamente.',
                totalEnviado,
                totalCalculado
            });
        }

        // Se o total não foi enviado, use o calculado
        const id = await ordersModel.criarPedido({
            tutorId,
            petId,
            products,
            services,
            total: totalCalculado,
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

        const totalCalculado = await calcularTotalPedido(products, services);

        // Verifica se o total enviado é igual ao total calculado
        if (totalEnviado !== undefined && Math.abs(totalCalculado - totalEnviado) > 0.05) {
            return res.status(400).json({
                erro: 'Total inconsistente com a soma realizada internamente.',
                totalEnviado,
                totalCalculado
            });
        }
        
        // Se o total não foi enviado, use o calculado
        await ordersModel.atualizarPedido(id, { 
            tutorId,
            petId,
            products,
            services,
            total: totalCalculado,
            status,
        });

        res.json({ mensagem: 'Pedido atualizado com sucesso', id });

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