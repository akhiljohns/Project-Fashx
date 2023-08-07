const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const db = require('./config/connection');
db.connect();
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const session = require('express-session');
const backButtonMiddleware = require('./middlewares/backButtonMiddleware');
const errormiddleware = require('./middlewares/errormiddleware');
const  handlebars = require('handlebars');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SESSION_SECRET;
handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});
handlebars.registerHelper('nq', function (a, b) {
  return a !== b;
});

handlebars.registerHelper('lt', function (a, b) {
  return a < b;
});
handlebars.registerHelper('add', function (a, b) {
  return a + b;
});
handlebars.registerHelper('less', function (a, b) {
  return a - b;
});
handlebars.registerHelper('break', function (options) {
  // Do nothing and return an empty string
  return '';
});

const app = express();

// Use backButtonMiddleware before any other middleware or routes

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: secretKey,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 },
    resave: false,
  })
);
app.use(backButtonMiddleware);

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store');
  next();
});

app.use('/admin', adminRouter);
app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(errormiddleware);

module.exports = app;
