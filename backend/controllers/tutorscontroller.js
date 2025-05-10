const tutorModel = require('../models/tutor');

const listarTutores = async (req, res, next) => {
    try {
        const tutors = await tutorModel.pegarTutores();
        res.json(tutors);
    } catch (err) {
        next(err);
    }
};

const buscarTutorPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const tutor = await tutorModel.pegarTutorPorId(id);
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
        const tutorId = await tutorModel.criarTutor(req.body);
        res.status(201).json({ mensagem: 'Tutor criado com sucesso', tutorId });
    } catch (err) {
        next(err);
    }
};

const atualizarTutor = async (req, res, next) => {
    const { id } = req.params;
    try {
        await tutorModel.atualizarTutor(id, req.body);
        res.json({ mensagem: 'Tutor atualizado com sucesso' });
    } catch (err) {
        next(err);
    }
};

const deletarTutor = async (req, res, next) => {
    const { id } = req.params;
    try {
        await tutorModel.apagarTutor(id);
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