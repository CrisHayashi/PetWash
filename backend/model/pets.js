const fs = require('fs');
const banco = 'pets';
const db = require('../banco/database');

function pegarPets(res, next) {
    db.all(`SELECT * FROM ${banco}`, (err, data) => {
        if (err) {
            console.error(err);
            return next(err);
        } else {
            return res.json(data);
        }
    });
}

function pegarPetPorId(req, res, next) {
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

function criarPet(req, res) {
    const corpo = req.body;

    for (let key in corpo) {
        if (key.trim() === "") {
            return res.json('Preencha todos os campos!');
        }
    }
    db.run(`INSERT INTO ${banco} 
                    (name, species, age, tutorId)
                    values
                    (?, ?, ?, ?)
                    `, [corpo.name, corpo.species, corpo.age, corpo.tutorId], function (err) {
        if (err) {
            console.error(err);
            console.log(corpo)
            return res.status(500).json({ error: 'Erro ao inserir o elemento' });
        }
        return res.json('Elemento inserido!');
    });
}

function atualizarPet(req, res) {
    const id = Number(req.params.id);
    const corpo = req.body;

    db.get(`SELECT * FROM ${banco} WHERE id= ?`, [id], (err, row) => {
        if (!row) {
            return res.json('Id não encontrado.')
        }

        const novoCorpo = {}; // cria um novo objeto para receber os dados atualizados
        // percorre o 'row' verificando se o campo existe e se também está vazio
        for (let key in row) {
            novoCorpo[key] = corpo.hasOwnProperty(key) // confere a existencia do campo em 'row', no corpo da requisição
            ? (typeof corpo[key] === "string" ? corpo[key].trim() : corpo[key]) // verifica se é uma string e tira os espaços em branco
            : row[key]; // se não existir, mantém o valor original do 'row'
        }

        db.run(`UPDATE ${banco} 
            SET name=?, species=?, age=?, tutorId=?
            WHERE id=?`, [novoCorpo.name, novoCorpo.species, novoCorpo.age, novoCorpo.tutorId, id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o elemento' });
            }
            return res.json('Elemento atualizado!');
        });
    });
}

function apagarPet(req, res) {
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
    pegarPets,
    pegarPetPorId,
    criarPet,
    atualizarPet,
    apagarPet
};