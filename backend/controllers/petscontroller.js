const petsModel = require('../model/petsModel');
const tutorsModel = require('../model/tutorsModel');

const listarPets = async () => {
    const pets = await petsModel.listarPets();
    return pets;
};

const listarTutores = async () => {
  const tutors = await tutorsModel.listarTutores();
  return tutors;
};

const paginaPets = async (req, res, next) => {
  try {
    const pets = await petsModel.listarPets();
    const tutors = await tutorsModel.listarTutores();
    res.render('layout/layout', {
      title: 'Gestão de Pets',
      body: 'pages/pets',
      pets,
      tutors
    });
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
    listarTutores,
    paginaPets,
    buscarPetPorId,
    criarPet,
    atualizarPet,
    deletarPet
};