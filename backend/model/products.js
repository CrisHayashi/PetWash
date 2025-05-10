const table = 'products';
const db = require('../banco/database');

const pegarProdutos = async () => {
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

const pegarProdutoPorId = async (id) => {
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

const criarProduto = async (productData) => {
    const { name, description, price, category, stock } = productData;
    try {
        const productId = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO ${table} (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)`,
                [name, description, price, category, stock],
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

const atualizarProduto = async (id, productData) => {
    const { name, description, price, category, stock } = productData;
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, description = ?, price = ?, category = ?, stock = ? WHERE id = ?`,
                [name, description, price, category, stock, id],
                function (err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao atualizar produto: ' + err.message);
    }
};

const apagarProduto = async (id) => {
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
    pegarProdutos,
    pegarProdutoPorId,
    criarProduto,
    atualizarProduto,
    apagarProduto
};