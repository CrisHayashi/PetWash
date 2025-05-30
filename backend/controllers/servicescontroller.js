const servicesModel = require('../models/servicesModel');

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
        const serviceId = await servicesModel.criarServico(req.body);
        res.status(201).json({ mensagem: 'Servico criado com sucesso', serviceId });
    } catch (err) {
        next(err);
    }
};

const atualizarServicoParcial = async (req, res, next) => {
    const { id } = req.params;

    // Verifica se o corpo tem pelo menos uma propriedade valida
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ erro: 'Corpo da requisição vazio. Envie ao menos um campo para atualizar.' });
    }

    try {
        await servicesModel.atualizarServicoParcial(id, req.body);
        res.json({ mensagem: 'Serviço atualizado parcialmente com sucesso' });
    } catch (err) {
        if (err.message.includes('não encontrado')) {
            return res.status(404).json({ erro: err.message });
        }
        next(err);
    }
};

const atualizarServicoCompleto = async (req, res, next) => {
    const { id } = req.params;
    try {
        await servicesModel.atualizarServicoCompleto(id, req.body);
        res.json({ mensagem: 'Serviço atualizado com sucesso' });
    } catch (err) {
       if (err.message.includes('não encontrado')) {
            return res.status(404).json({ erro: err.message });
        }
        next(err);
    }
};

const deletarServico = async (req, res, next) => {
    const { id } = req.params;
    try {
        await servicesModel.deletarServico(id);
        res.json({ mensagem: 'Servico removido com sucesso' });
    } catch (err) {
        if (err.message.includes('não encontrado')) {
            return res.status(404).json({ erro: err.message });
        }
        next(err);
    }
};


module.exports = {
    listarServicos,
    buscarServicoPorId,
    criarServico,
    atualizarServicoParcial,
    atualizarServicoCompleto,
    deletarServico
};  