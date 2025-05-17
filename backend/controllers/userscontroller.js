const usersModel = require('../model/usersModel');  // Importa o modelo de usuários
const gerarToken = require('../auth/gerarToken');  // Função para gerar o token JWT

// Função para pegar todos os usuários
const listarUsuarios = async (req, res, next) => {
  try {
    const users = await usersModel.listarUsuarios();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);  // Log do erro para debug
    next(err);
  }
};

// Função para pegar usuário por ID
const buscarUsuarioPorId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await usersModel.buscarUsuarioPorId(id);
    if (user) {
      res.status(200).json(user);
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
    const dadosAtualizados = { name, email };
    if (password) {
      dadosAtualizados.password = password;  // Só envia se realmente houver uma nova senha
    }

    const usuarioAtualizado = await usersModel.atualizarUsuario(userId, dadosAtualizados);
    // Se o usuário foi atualizado, retorna o usuário atualizado
    // Caso contrário, retorna 404 
  
    if (usuarioAtualizado) {
      res.status(200).json(usuarioAtualizado);
    }
    else {
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
    const user = await usersModel.verificarSenha(email, password);  // Usa verificação do model
    const token = gerarToken(user);

    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
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