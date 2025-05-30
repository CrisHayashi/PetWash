const productsModel = require('../models/productsModel');

const listarProdutos = async (req, res, next) => {
    try {
        const products = await productsModel.listarProdutos();
        res.json(products);
    } catch (err) {
        next(err);
    }
};
const buscarProdutoPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await productsModel.buscarProdutoPorId(id);
        if (!product) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

const criarProduto = async (req, res, next) => {
    try {
        const productId = await productsModel.criarProduto(req.body);
        res.status(201).json({ mensagem: 'Produto criado com sucesso', productId });
    } catch (err) {
        next(err);
    }
};

const atualizarProdutoParcial = async (req, res, next) => {
    const { id } = req.params;
    try {
        // A atualização parcial deve passar apenas os campos enviados no corpo da requisição
        await productsModel.atualizarProdutoParcial(id, req.body);
        res.json({ mensagem: 'Produto atualizado parcialmente com sucesso' });
    } catch (err) {
        next(err);
    }
};

const atualizarProdutoCompleto = async (req, res, next) => {
    const { id } = req.params;
    try {
        // A atualização completa substitui todos os campos do produto
        await productsModel.atualizarProdutoCompleto(id, req.body);
        res.json({ mensagem: 'Produto atualizado completamente com sucesso' });
    } catch (err) {
        next(err);
    }
};

const deletarProduto = async (req, res, next) => {
    const { id } = req.params;
    try {
        await productsModel.deletarProduto(id);
        res.json({ mensagem: 'Produto removido com sucesso' });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProdutoParcial,
    atualizarProdutoCompleto,
    deletarProduto
};