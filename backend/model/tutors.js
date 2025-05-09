const fs = require('fs');
// const localDoBanco = 'banco/tutors.json'; // local do banco de dados json
const banco = 'tutors'; // nome da tabela do banco de dados
const db = require('../banco/database');

// function pegarTutores(res, next) {
//     fs.readFile(`${localDoBanco}`, (err, data) => {
//         if (err) {
//             console.error(err);
//             return next(err); // uso do next para retornar o erro > está localizado em app.js
//         }
//         const endpoint = JSON.parse(data);
//         return res.json(endpoint);
//     });
// }

function pegarTutores(res, next) {
    db.all(`SELECT * FROM ${banco}`, (err, data) => {
        if (err) {
            console.error(err);
            return next(err); // uso do next para retornar o erro > está localizado em app.js
        } else {
            return res.json(data);
        }
    });
}

function pegarTutorPorId(req, res, next) {
    const id = Number(req.params.id); // recebe o id (como string) do tutor a ser deletado e converte para numero
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

function criarTutor(req, res) {
    const corpo = req.body;

    for (let key in corpo) {
        if (key.trim() === "") {
            return res.json('Preencha todos os campos!');
        }
    }
    db.get(`
            SELECT email FROM ${banco} WHERE email = ?`, [corpo.email], (err, row) => {
        if (row) {
            return res.json('Email já cadastrado.');
        }
        db.run(`INSERT INTO ${banco} 
                    (name, email, phone)
                    values
                    (?, ?, ?)
                    `, [corpo.name, corpo.email, corpo.phone], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao inserir o elemento' });
            }
            return res.json('Elemento inserido!');
        });
    });
}

function atualizarTutor(req, res) {
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
            SET name=?, email=?, phone=? 
            WHERE id=?`, [novoCorpo.name, novoCorpo.email, novoCorpo.phone, id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o elemento' });
            }
            return res.json('Elemento atualizado!');
        });
    });
}

function apagarTutor(req, res) {
    const id = Number(req.params.id);

    // verifica se tem pets associados
    db.all(`SELECT * FROM pets WHERE tutorId = ?`, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao verificar tabela' });
        }
        if (rows.length !== 0) {
            return res.status(400).json({ success: false, message: "Não é possível deletar um tutor que tenha pets associados!" });
        }

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
    });
}

module.exports = {
    pegarTutores,
    pegarTutorPorId,
    criarTutor,
    atualizarTutor,
    apagarTutor
};