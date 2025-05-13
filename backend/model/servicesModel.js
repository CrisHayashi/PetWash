const table = 'services';
const db = require('../banco/database');

const listarServicos = async () => {
    try {
        const services = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        return services;
    } catch (err) {
        throw new Error('Erro ao buscar serviços: ' + err.message);
    }
};

const buscarServicoPorId = async (id) => {
    try {
        const service = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        return service;
    } catch (err) {
        throw new Error('Erro ao buscar serviço por ID: ' + err.message);
    }
};

const criarServico = async (serviceData) => {
    const { name, description, price, duration } = serviceData;
    try {
        const serviceId = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO ${table} (name, description, price, duration) VALUES (?, ?, ?, ?)`,
                [name, description, price, duration],
                function (err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
        return serviceId;
    } catch (err) {
        throw new Error('Erro ao criar serviço: ' + err.message);
    }
};

const atualizarServico = async (id, serviceData) => {
    const { name, description, price, duration } = serviceData;
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?`,
                [name, description, price, duration, id],
                function (err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao atualizar serviço: ' + err.message);
    }
};

const deletarServico = async (id) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao apagar serviço: ' + err.message);
    }
};

module.exports = {
    listarServicos,
    buscarServicoPorId,
    criarServico,
    atualizarServico,
    deletarServico
};