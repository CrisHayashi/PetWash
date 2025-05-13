const productsModel = require('../model/productsModel');

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
        const product = await petsModel.buscarProdutoPorId(id);
        if (!product) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        res.json(pet);
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

const atualizarProduto = async (req, res, next) => {
    const { id } = req.params;
    try {
        await productsModel.atualizarProduto(id, req.body);
        res.json({ mensagem: 'Produto atualizado com sucesso' });
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
    atualizarProduto,
    deletarProduto
};