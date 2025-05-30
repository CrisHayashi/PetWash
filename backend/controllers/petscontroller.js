const petsModel = require('../models/petsModel');
const tutorsModel = require('../models/tutorsModel');

const listarPets = async (req, res, next) => {
    try {
        const pets = await petsModel.listarPets();
        res.json(pets);
    } catch (err) {
        next(err);
    }
};

const listarTutores = async () => {
  const tutors = await tutorsModel.listarTutores();
  return tutors;
};

const buscarPetPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pet = await petsModel.buscarPetPorId(id);
        if (!pet) {
            return res.status(404).json({ erro: 'Pet não encontrado' });
        }
        res.json(pet);
    } catch (err) {
        next(err);
    }
};

const criarPet = async (req, res, next) => {
    try {
        const petId = await petsModel.criarPet(req.body);
        res.status(201).json({ mensagem: 'Pet criado com sucesso', petId });
    } catch (err) {
        next(err);
    }
};

const atualizarPetParcial = async (req, res, next) => {
    const { id } = req.params;
    try {
        await petsModel.atualizarPetParcial(id, req.body);
        res.json({ mensagem: 'Pet atualizado parcialmente com sucesso' });
    } catch (err) {
        if (err.message.includes('Pet não encontrado')) {
            return res.status(404).json({ erro: err.message });
        }
        next(err);
    }
};

const atualizarPetCompleto = async (req, res, next) => {
    const { id } = req.params;
    try {
        await petsModel.atualizarPetCompleto(id, req.body);
        res.json({ mensagem: 'Pet atualizado com sucesso' });
    } catch (err) {
        if (err.message.includes('Pet não encontrado')) {
            return res.status(404).json({ erro: err.message });
        }
        next(err);
    }
};

const deletarPet = async (req, res, next) => {
    const { id } = req.params;
    try {
        await petsModel.deletarPet(id);
        res.json({ mensagem: 'Pet removido com sucesso' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listarPets,
    listarTutores,
    buscarPetPorId,
    criarPet,
    atualizarPetParcial,
    atualizarPetCompleto,
    deletarPet
};