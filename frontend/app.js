var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var petsRouter = require('./routes/pets');
var tutorsRouter = require('./routes/tutors');
var productsRouter = require('./routes/products');
var servicesRouter = require('./routes/services');
var ordersRouter = require('./routes/orders');

var app = express();

// Define a pasta de views para as páginas EJS
app.set('view engine', 'ejs'); // Define o motor de visualização como EJS
app.set('views', path.join(__dirname, 'views')); // Define o diretório onde estão os arquivos EJS
app.set('layout', 'layout/layout'); // Define o layout padrão

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts); // Habilita o uso de layouts
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pets', petsRouter);
app.use('/tutors', tutorsRouter);
app.use('/products', productsRouter);
app.use('/services', servicesRouter);
app.use('/orders', ordersRouter);

// title padrão para todas as páginas
app.use((req, res, next) => {
  res.locals.title = 'PetWash'; // Título padrão
  next();
});

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
  res.render('error', { error: err });
});

module.exports = app;
