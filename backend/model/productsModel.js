const table = 'products';
const db = require('../banco/database');

const listarProdutos = async () => {
    try {
        const products = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        return products;
    } catch (err) {
        throw new Error('Erro ao buscar produtos: ' + err.message);
    }
};

const buscarProdutoPorId = async (id) => {
    try {
        const product = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        return product;
    } catch (err) {
        throw new Error('Erro ao buscar produto por ID: ' + err.message);
    }
};

const criarProduto = async ({ name, price, category, stock }) => {
    try {
        const productId = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO ${table} (name, price, category, stock) VALUES (?, ?, ?, ?)`,
                [name, price, category, stock],
                function (err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
        return productId;
    } catch (err) {
        throw new Error('Erro ao criar produto: ' + err.message);
    }
};

// Atualização completa (PUT)
const atualizarProdutoCompleto = async (id, { name, price, category, stock }) => {
    if (!name || price == null || !category || stock == null) {
        throw new Error('Campos obrigatórios ausentes para atualização completa');
    }

    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, price = ?, category = ?, stock = ? WHERE id = ?`,
                [name, price, category, stock, id],
                function (err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    } catch (err) {
        throw new Error('Erro ao atualizar produto completamente: ' + err.message);
    }
};

// Atualização parcial (PATCH)
const atualizarProdutoParcial = async (id, dados) => {
    try {
        const campos = Object.keys(dados);
        const valores = Object.values(dados);

        if (campos.length === 0) {
            throw new Error('Nenhum campo enviado para atualização parcial');
        }

        const setClause = campos.map(campo => `${campo} = ?`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;

        await new Promise((resolve, reject) => {
            db.run(query, [...valores, id], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
    } catch (err) {
        throw new Error('Erro ao atualizar produto parcialmente: ' + err.message);
    }
};

const deletarProduto = async (id) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao apagar produto: ' + err.message);
    }
};

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProdutoCompleto,
    atualizarProdutoParcial,
    deletarProduto
};