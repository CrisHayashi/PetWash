const model = require('../models/products');

function listarProdutos(req, res) {
    model.listarTodos((err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar produtos' });
        res.json(rows);
    });
}

function buscarProdutoPorId(req, res) {
    const id = Number(req.params.id);

    model.buscarPorId(id, (err, row) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar produto' });
        if (!row) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json(row);
    });
}

function criarProduto(req, res) {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }

    model.criar(name, price, (err, id) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar produto' });
        res.status(201).json({ message: 'Produto criado com sucesso', id });
    });
}

function atualizarProduto(req, res) {
    const id = Number(req.params.id);
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }

    model.atualizar(id, name, price, (err, changes) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar produto' });
        if (changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json({ message: 'Produto atualizado com sucesso' });
    });
}

function deletarProduto(req, res) {
    const id = Number(req.params.id);

    model.deletar(id, (err, changes) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar produto' });
        if (changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json({ message: 'Produto removido com sucesso' });
    });
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto
};