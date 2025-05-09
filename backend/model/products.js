const fs = require('fs');
const banco = 'products';
const db = require('../banco/database');

function pegarProdutos(res, next) {
    db.all(`SELECT * FROM ${banco}`, (err, data) => {
        if (err) {
            console.error(err);
            return next(err);
        } else {
            return res.json(data);
        }
    });
}

function pegarProdutoPorId(req, res, next) {
    const id = Number(req.params.id);
    db.all(`SELECT * FROM ${banco} WHERE id = ?`, [id], (err, data) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (data.length === 0) {
            console.error(err);
            return res.json('Não encontrado');
        }
        return res.json(data);
    });
}

function criarProduto(req, res) {
    const corpo = req.body;

    for (let key in corpo) {
        if (key.trim() === "") {
            return res.json('Preencha todos os campos!');
        }
    }
    db.run(`INSERT INTO ${banco} 
                    (name, price, category, stock)
                    values
                    (?, ?, ?, ?)
                    `, [corpo.name, corpo.price, corpo.category, corpo.stock], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao inserir o elemento' });
        }
        return res.json('Elemento inserido!');
    });
}

function atualizarProduto(req, res) {
    const id = Number(req.params.id);
    const corpo = req.body;

    db.get(`SELECT * FROM ${banco} WHERE id= ?`, [id], (err, row) => {
        if (!row) {
            return res.json('Id não encontrado.')
        }

        const novoCorpo = {};
        for (let key in row) {
            novoCorpo[key] = corpo.hasOwnProperty(key) ? (typeof corpo[key] === "string" ? corpo[key].trim() : corpo[key]) : row[key];
        }

        db.run(`UPDATE ${banco} 
            SET name=?, price=?, category=?, stock=?
            WHERE id=?`, [novoCorpo.name, novoCorpo.price, novoCorpo.category, novoCorpo.stock, id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o elemento' });
            }
            return res.json('Elemento atualizado!');
        });
    });
}

function apagarProduto(req, res) {
    const id = Number(req.params.id);
    db.get(`SELECT * FROM ${banco} WHERE id= ?`, [id], (err, rows) => {
        if (!rows) {
            return res.json('Id não encontrado.')
        }
        db.run(`DELETE FROM ${banco} WHERE id= ?`, [id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao apagar o elemento' });
            }
            return res.json('Elemento apagado!');
        });
    });
}

module.exports = {
    pegarProdutos,
    pegarProdutoPorId,
    criarProduto,
    atualizarProduto,
    apagarProduto
};