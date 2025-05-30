const table = 'pets';
const db = require('../banco/database');

// Função para listar todos os pets
const listarPets = async () => {
    try {
        const pets = await new Promise((resolve, reject) => {
            const sql = `SELECT 
                    pets.id,
                    pets.name,
                    pets.species,
                    pets.breed,
                    pets.age,
                    pets.tutorId,
                    tutors.name AS tutorName
                FROM pets
                LEFT JOIN tutors ON pets.tutorId = tutors.id
            `;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        return pets;
    } catch (err) {
        throw new Error('Erro ao buscar pets: ' + err.message);
    }
};

// Função para buscar um pet por ID
const buscarPetPorId = async (id) => {
    try {
        const pet = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        return pet;
    } catch (err) {
        throw new Error('Erro ao buscar pet por ID: ' + err.message);
    }
};

// Função para criar um pet
const criarPet = async (petData) => {
    const { name, species, breed, age, tutorId } = petData;
    try {
        const petId = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO ${table} (name, species, breed, age, tutorId) VALUES (?, ?, ?, ?, ?)`,
                [name, species, breed, age, tutorId],
                function (err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
        return petId;
    } catch (err) {
        throw new Error('Erro ao criar pet: ' + err.message);
    }
};

// Função para atualizar um pet (atualização completa - PUT)
const atualizarPetCompleto = async (id, { name, species, breed, age, tutorId }) => {
    try {
        const changes = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, species = ?, breed = ?, age = ?, tutorId = ? WHERE id = ?`,
                [name, species, breed, age, tutorId, id],
                function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error('Pet não encontrado para atualizar.'));
                    resolve(this.changes);
                }
            );
        });
        return changes;
    } catch (err) {
        throw new Error('Erro ao atualizar pet, com todos os campos: ' + err.message);
    }
};

// Atualização parcial (PATCH)
const atualizarPetParcial = async (id, data) => {
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
            throw new Error('Nenhum campo enviado para atualização parcial');
        }

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET ${campos.join(', ')} WHERE id = ?`,
                [...valores, id],
                function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error('Pet não encontrado para atualizar.'));
                    resolve();
                }
            );
        });
        return result; 
    } catch (err) {
        throw new Error('Erro ao atualizar pet parcialmente: ' + err.message);
    }
};

// Função para apagar um pet
const deletarPet = async (id) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao remover pet: ' + err.message);
    }
};

module.exports = {
    listarPets,
    buscarPetPorId,
    criarPet,
    atualizarPetCompleto,
    atualizarPetParcial,
    deletarPet
};