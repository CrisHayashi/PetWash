require('dotenv').config(); // Carrega variáveis de ambiente
console.log("JWT_SECRET carregado:", process.env.JWT_SECRET);

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');

// Swagger para documentação da API
const { swaggerUi, swaggerSpec } = require('./routes/swagger');

// Middleware de autenticação JWT
const authenticateToken = require('./auth/authenticateToken');

// Importação de rotas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tutorsRouter = require('./routes/tutors');
const petsRouter = require('./routes/pets');
const productsRouter = require('./routes/products');
const servicesRouter = require('./routes/services');
const ordersRouter = require('./routes/orders');

const app = express();

// VIEW ENGINE (opcional caso esteja usando páginas HTML no backend)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARES GLOBAIS
app.use(cors());                      // Libera CORS para o frontend
app.use(logger('dev'));              // Logs no console
app.use(express.json());             // Para JSON
app.use(express.urlencoded({ extended: false })); // Para forms
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static(path.join(__dirname, '../frontend/libs'))); // libs do frontend
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});
// ROTAS PÚBLICAS (sem autenticação)
app.use('/users', usersRouter); // Usuários e login

// ROTAS PROTEGIDAS (com JWT)
// app.use(authenticateToken);
app.use('/', indexRouter);
app.use('/tutors', tutorsRouter);
app.use('/pets', petsRouter);
app.use('/products', productsRouter);
app.use('/services', servicesRouter);
app.use('/orders', ordersRouter);

// DOCUMENTAÇÃO SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ERRO 404
app.use((req, res, next) => {
  next(createError(404));
});

// ERRO GERAL
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(err.status || 500).json({
    erro: 'Erro interno no servidor',
    detalhes: err.message
  });
});

module.exports = app;