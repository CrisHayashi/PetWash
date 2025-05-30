const table = 'tutors';
const db = require('../banco/database');

// Função para listar todos os tutores
const listarTutores = async () => {
    try {
        const tutors = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        return tutors;
    } catch (err) {
        throw new Error('Erro ao buscar tutores: ' + err.message);
    }
};

// Função para buscar um tutor por ID
const buscarTutorPorId = async (id) => {
    try {
        const tutor = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        return tutor;
    } catch (err) {
        throw new Error('Erro ao buscar tutor por ID: ' + err.message);
    }
};

// Função para criar um tutor
const criarTutor = async (tutorData) => {
    const { name, email, phone, address } = tutorData;
    try {
        const tutorId = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO ${table} (name, email, phone, address) VALUES (?, ?, ?, ?)`,
                [name, email, phone, address],
                function (err) {
                    if (err) {
                        reject(err) 
                    };
                    resolve(this.lastID);
                }
            );
        });
        return tutorId;
    } catch (err) {
        throw new Error('Erro ao criar tutor: ' + err.message);
    }
};

// Atualização completa (PUT)
const atualizarTutorCompleto = async (id, { name, email, phone, address }) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`,
                [name, email, phone, address, id],
                function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error('Tutor não encontrado para atualizar.'));
                    resolve();
                }
            );
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao atualizar tutor em todos os campos: ' + err.message);
    }
};

// Função para atualizar um tutor (atualização parcial - PATCH)
const atualizarTutorParcial = async (id, data) => {
    const campos = [];
    const valores = [];

    for (let chave in data) {
        if (data[chave] !== undefined) {
            campos.push(`${chave} = ?`);
            valores.push(data[chave]);
        }
    }
    if (campos.length === 0) {
        throw new Error('Nenhum campo fornecido para atualização parcial.');
    }

    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET ${campos.join(', ')} WHERE id = ?`,
                [...valores, id],
                function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error('Tutor não encontrado para atualizar.'));
                    resolve();
                }
            );
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao atualizar tutor parcialmente: ' + err.message);
    }
};

const deletarTutor = async (id) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao remover tutor: ' + err.message);
    }
};

module.exports = {
    listarTutores,
    buscarTutorPorId,
    criarTutor,
    atualizarTutorCompleto,
    atualizarTutorParcial,
    deletarTutor
};