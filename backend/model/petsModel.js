const table = 'pets';
const db = require('../banco/database');

// Função para pegar todos os pets
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
                else resolve(rows);
            });
        });
        return pets;
    } catch (err) {
        throw new Error('Erro ao buscar pets: ' + err.message);
    }
};

// Função para pegar um pet por ID
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

// Função para atualizar um pet
const atualizarPet = async (id, petData) => {
    const { name, species, breed, age, tutorId } = petData;
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET name = ?, species = ?, breed = ?, age = ?, tutorId = ? WHERE id = ?`,
                [name, species, breed, age, tutorId, id],
                function (err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao atualizar pet: ' + err.message);
    }
};

// Função para apagar um pet
const deletarPet = async (id) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
        return id;
    } catch (err) {
        throw new Error('Erro ao apagar pet: ' + err.message);
    }
};

module.exports = {
    listarPets,
    buscarPetPorId,
    criarPet,
    atualizarPet,
    deletarPet
};