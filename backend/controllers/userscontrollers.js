const usersModel = require('../models/usersModel');  // Importa o modelo de usuários
const gerarToken = require('../auth/auth');  // Função para gerar o token JWT

// Função para pegar todos os usuários
const pegarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usersModel.pegarUsuarios();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error(err);  // Log do erro para debug
    next(err);
  }
};

// Função para pegar usuário por ID
const pegarUsuarioPorId = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const usuario = await usersModel.pegarUsuarioPorId(userId);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (err) {
    next(err);
  }
};

// Função para criar um novo usuário
const criarUsuario = async (req, res, next) => {
  const { name, email, password } = req.body;  // Assumindo que os dados sejam enviados no corpo da requisição
  try {
    const novoUsuario = await usersModel.criarUsuario({ name, email, password });
    res.status(201).json(novoUsuario);  // Retorna o usuário criado com status 201
  } catch (err) {
    console.error(err);  // Log do erro para debug
    next(err);
  }
};

// Função para atualizar um usuário existente
const atualizarUsuario = async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;
  try {
    const usuarioAtualizado = await usersModel.atualizarUsuario(userId, { name, email, password });
    if (usuarioAtualizado) {
      res.status(200).json(usuarioAtualizado);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error(err);  // Log do erro para debug
    next(err);
  }
};

// Função para deletar um usuário
const deletarUsuario = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const resultado = await usersModel.deletarUsuario(userId);
    if (resultado) {
      res.status(204).send();  // Retorna 204 No Content se o usuário foi deletado com sucesso
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error(err);  // Log do erro para debug
    next(err);
  }
};

// Função de login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Verifica a senha durante o login
    const usuario = await usersModel.verificarSenha(email, password);

    // Gerar o token
    const token = gerarToken(usuario);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  pegarUsuarios,
  pegarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
  login
};