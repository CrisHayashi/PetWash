const tutorsModel = require('../model/tutorsModel');

const listarTutores = async (req, res, next) => {
    try {
        const tutors = await tutorsModel.listarTutores();
        res.json(tutors);
    } catch (err) {
        next(err);
    }
};

const buscarTutorPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const tutor = await tutorsModel.buscarTutorPorId(id);
        if (!tutor) {
            return res.status(404).json({ erro: 'Tutor não encontrado' });
        }
        res.json(tutor);
    } catch (err) {
        next(err);
    }
};

const criarTutor = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ erro: 'Corpo da requisição vazio ou inválido' });
        }
        
        const tutorId = await tutorsModel.criarTutor(req.body);
        console.log(req.body)
        res.status(201).json({ mensagem: 'Tutor criado com sucesso', tutorId });
    } catch (err) {
        next(err);
    }
};

const atualizarTutor = async (req, res, next) => {
    const { id } = req.params;
    const metodo = req.method; // PUT ou PATCH
    const { name, email, phone, address } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ erro: 'ID do tutor não fornecido' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ erro: 'Corpo da requisição vazio ou inválido' });
        }

        if (metodo === 'PUT') {
            // Exige todos os campos
            if (!name || !email || !phone || !address) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios para PUT' });
            }
        }

        // Atualiza apenas os campos recebidos
        const tutorAtual = await tutorsModel.buscarTutorPorId(id);
        if (!tutorAtual) {
            return res.status(404).json({ erro: 'Tutor não encontrado' });
        }

        const tutorAtualizado = {
            name: name ?? tutorAtual.name,
            email: email ?? tutorAtual.email,
            phone: phone ?? tutorAtual.phone,
            address: address ?? tutorAtual.address,
        };

        await tutorsModel.atualizarTutor(id, tutorAtualizado);

        res.status(200).json({ mensagem: 'Tutor atualizado com sucesso' });
    } catch (err) {
        next(err);
    }
};


const deletarTutor = async (req, res, next) => {
    const { id } = req.params;
    try {
        await tutorsModel.deletarTutor(id);
        res.json({ mensagem: 'Tutor removido com sucesso' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listarTutores,
    buscarTutorPorId,
    criarTutor,
    atualizarTutor,
    deletarTutor
};