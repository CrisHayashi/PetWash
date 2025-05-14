const table = 'tutors';
const db = require('../banco/database');

const listarTutores = async () => {
    try {
        const tutors = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        return tutors;
    } catch (err) {
        throw new Error('Erro ao buscar tutores: ' + err.message);
    }
};

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

const atualizarTutor = async (id, tutorData) => {
    const { name, email, phone, address } = tutorData;
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`,
                [name, email, phone, address, id],
                function (err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao atualizar tutor: ' + err.message);
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
        throw new Error('Erro ao apagar tutor: ' + err.message);
    }
};

module.exports = {
    listarTutores,
    buscarTutorPorId,
    criarTutor,
    atualizarTutor,
    deletarTutor
};