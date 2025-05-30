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

const atualizarServicoParcial = async (id, data) => {
    const campos = [];
    const valores = [];

    for (let chave in data) {
        // Ignorar campos inválidos ou vazios (opcional)
        if (data[chave] !== undefined) {
            campos.push(`${chave} = ?`);
            valores.push(data[chave]);
        }
    }
    if (campos.length === 0) {
        throw new Error('Nenhum dado fornecido para atualização parcial.');
    }    

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET ${campos.join(', ')} WHERE id = ?`,
                [...valores, id],
                function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error('Serviço não encontrado para atualizar.'));
                    resolve();
                }
            );
        });
        return result;
    } catch (err) {
        throw new Error('Erro ao atualizar serviço parcialmente: ' + err.message);
    }
};

const atualizarServicoCompleto = async (id, { name, description, price, duration }) => {
    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?`,
                [name, description, price, duration, id],
                function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error('Serviço não encontrado para atualizar.'));
                    resolve();
                }
            );
        });
        return result;
    } catch (err) {
        throw new Error('Erro ao atualizar serviço completamente: ' + err.message);
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
    atualizarServicoParcial,
    atualizarServicoCompleto,
    deletarServico
};