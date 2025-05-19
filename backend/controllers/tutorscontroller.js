const tutorsModel = require('../model/tutorsModel');

// Função para listar todos os tutores
const listarTutores = async (req, res, next) => {
    try {
        const tutors = await tutorsModel.listarTutores();
        res.json(tutors);
    } catch (err) {
        next(err);
    }
};

// Função para buscar um tutor pelo ID
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

// Função para criar um novo tutor
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

// PUT - Atualização completa
const atualizarTutorCompleto = async (req, res, next) => {
    // Extrai o ID dos parâmetros e os campos do corpo da requisição
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ erro: 'ID do tutor não fornecido' });
        }

        // Todos os campos são obrigatórios no PUT
        if (!name || !email || !phone || !address) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios para atualização completa (PUT)' });
        }

        const tutorAtual = await tutorsModel.buscarTutorPorId(id);
        if (!tutorAtual) {
            return res.status(404).json({ erro: 'Tutor não encontrado' });
        }

        const tutorAtualizado = { name, email, phone, address };

        await tutorsModel.atualizarTutorCompleto(id, tutorAtualizado);
        res.status(200).json({ mensagem: 'Tutor atualizado completamente com sucesso' });
    } catch (err) {
        next(err);
    }
};

// PATCH - Atualização parcial
const atualizarTutorParcial = async (req, res, next) => {
    // Extrai o ID dos parâmetros e os dados a atualizar do corpo da requisição
    const { id } = req.params;
    const camposAtualizar = req.body;

    try {
        if (!id) {
            return res.status(400).json({ erro: 'ID do tutor não fornecido' });
        }

        if (!camposAtualizar || Object.keys(camposAtualizar).length === 0) {
            return res.status(400).json({ erro: 'Nenhum dado enviado para atualização parcial' });
        }

        const tutorAtual = await tutorsModel.buscarTutorPorId(id);
        if (!tutorAtual) {
            return res.status(404).json({ erro: 'Tutor não encontrado' });
        }

        const tutorAtualizado = {
            name: camposAtualizar.name ?? tutorAtual.name,
            email: camposAtualizar.email ?? tutorAtual.email,
            phone: camposAtualizar.phone ?? tutorAtual.phone,
            address: camposAtualizar.address ?? tutorAtual.address,
        };

        await tutorsModel.atualizarTutorParcial(id, tutorAtualizado);
        res.status(200).json({ mensagem: 'Tutor atualizado parcialmente com sucesso' });
    } catch (err) {
        next(err);
    }
};

// Função para deletar um tutor pelo ID
const deletarTutor = async (req, res, next) => {
    const { id } = req.params;
    try {
        await tutorsModel.deletarTutor(id);
        res.json({ mensagem: 'Tutor removido com sucesso' });
    } catch (err) {
        next(err);
    }
};
// Exporta todas as funções definidas para serem utilizadas em outros arquivos
module.exports = {
    listarTutores,
    buscarTutorPorId,
    criarTutor,
    atualizarTutorCompleto,
    atualizarTutorParcial,
    deletarTutor
};