const petModel = require('../models/pet');

const listarPets = async (req, res, next) => {
    try {
        const pets = await petModel.pegarPets();
        res.json(pets);
    } catch (err) {
        next(err);
    }
};

const buscarPetPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pet = await petModel.pegarPetPorId(id);
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
        const petId = await petModel.criarPet(req.body);
        res.status(201).json({ mensagem: 'Pet criado com sucesso', petId });
    } catch (err) {
        next(err);
    }
};

const atualizarPet = async (req, res, next) => {
    const { id } = req.params;
    try {
        await petModel.atualizarPet(id, req.body);
        res.json({ mensagem: 'Pet atualizado com sucesso' });
    } catch (err) {
        next(err);
    }
};

const deletarPet = async (req, res, next) => {
    const { id } = req.params;
    try {
        await petModel.apagarPet(id);
        res.json({ mensagem: 'Pet removido com sucesso' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listarPets,
    buscarPetPorId,
    criarPet,
    atualizarPet,
    deletarPet
};