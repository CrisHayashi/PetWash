const petsModel = require('../model/petsModel');

const listarPets = async (req, res, next) => {
    try {
        const pets = await petsModel.listarPets();
        res.json(pets);
    } catch (err) {
        next(err);
    }
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

const atualizarPet = async (req, res, next) => {
    const { id } = req.params;
    try {
        await petsModel.atualizarPet(id, req.body);
        res.json({ mensagem: 'Pet atualizado com sucesso' });
    } catch (err) {
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
    buscarPetPorId,
    criarPet,
    atualizarPet,
    deletarPet
};