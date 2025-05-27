require('dotenv').config();

console.log("JWT_SECRET carregado:", process.env.JWT_SECRET);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./routes/swagger');
const swaggerJsdoc = require('swagger-jsdoc');

//Importe das rotas /ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const tutorsRouter = require('./routes/tutors');
const petsRouter = require('./routes/pets');
const productsRouter = require('./routes/products');
const servicesRouter = require('./routes/services');
const ordersRouter = require('./routes/orders');
const loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static(path.join(__dirname, '../frontend/libs')));

//Define os endpoints para as rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tutors', tutorsRouter);
app.use('/pets', petsRouter);
app.use('/products', productsRouter);
app.use('/services', servicesRouter);
app.use('/orders', ordersRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({erro: 'Not Found'});
});

app.use((err, req, res, next) => {
  console.error('Erro interno:', err);    // Log no console para debugging
  res.status(500).json({ 
    erro: 'Erro interno no servidor', 
    detalhes: err.message 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: err.message });
});

module.exports = app;
