const usersModel = require('../models/usersModel');  // Importa o modelo de usuários
const bcrypt = require('bcryptjs');
const gerarToken = require('../auth/gerarToken');  // Função para gerar o token JWT

// Função de login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await usersModel.buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos' });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos' });
    }

    // Gera o token
    const token = gerarToken({ id: usuario.id, email: usuario.email });

    // Retorna o token e os dados públicos do usuário
    res.status(200).json({
      mensagem: 'Login bem-sucedido',
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email
      },
      token
    });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao realizar login', detalhe: error.message });
  }
};

// Função para pegar todos os usuários
const listarUsuarios = async (req, res, next) => {
  try {
    const users = await usersModel.listarUsuarios();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuários', detalhe: error.message });
  }
};

// Função para pegar usuário por ID
const buscarUsuarioPorId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await usersModel.buscarUsuarioPorId(id);

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuário', detalhe: error.message });
  }
};

// Função para criar um novo usuário
const criarUsuario = async (req, res, next) => {
  try{
    const { name, email, password } = req.body;  // Assumindo que os dados sejam enviados no corpo da requisição
  
    // Verifica se o e-mail já está cadastrado
    const existente = await usersModel.buscarUsuarioPorEmail(email);
    if (existente) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado' });
    }

    const novoUsuario = await usersModel.criarUsuario({ name, email, password });
    console.log(novoUsuario)
    res.status(201).json({ message: 'Usuário Criado com sucesso', usuario: novoUsuario});  // Retorna o usuário criado com status 201
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar usuário', detalhe: error.message });
  }
};

// Função para atualizar um usuário existente
const atualizarUsuario = async (req, res, next) => {
  try {
  const id = req.params.id;
  const { name, email, password } = req.body;

  const usuarioExistente = await usersModel.buscarUsuarioPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const usuarioAtualizado = await usersModel.atualizarUsuario(id, name, email);
    // Se o usuário foi atualizado, retorna o usuário atualizado
    // Caso contrário, retorna 404 
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: error.message });
  }
};

// Função para deletar um usuário
const deletarUsuario = async (req, res, next) => {
  try {
  const id = req.params.id;
  
  const resultado = await usersModel.deletarUsuario(id);
  if (!resultado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar usuário', detalhe: error.message });
  }
};

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
  login
};