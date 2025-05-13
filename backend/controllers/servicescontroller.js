const servicesModel = require('../model/servicesModel');

const listarServicos = async (req, res, next) => {
    try {
        const services = await servicesModel.listarServicos();
        res.json(services);
    } catch (err) {
        next(err);
    }
};
const buscarServicoPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const service = await servicesModel.buscarServicoPorId(id);
        if (!service) {
            return res.status(404).json({ erro: 'Serviço não encontrado' });
        }
        res.json(service);
    } catch (err) {
        next(err);
    }
};

const criarServico = async (req, res, next) => {
    try {
        const serviceId = await servicessModel.criarServico(req.body);
        res.status(201).json({ mensagem: 'Servico criado com sucesso', serviceId });
    } catch (err) {
        next(err);
    }
};

const atualizarServico = async (req, res, next) => {
    const { id } = req.params;
    try {
        await servicesModel.atualizarServico(id, req.body);
        res.json({ mensagem: 'Servico atualizado com sucesso' });
    } catch (err) {
        next(err);
    }
};

const deletarServico = async (req, res, next) => {
    const { id } = req.params;
    try {
        await servicesModel.deletarServico(id);
        res.json({ mensagem: 'Servico removido com sucesso' });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    listarServicos,
    buscarServicoPorId,
    criarServico,
    atualizarServico,
    deletarServico
};