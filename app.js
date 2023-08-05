var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var db = require('./config/connection');
db.connect();
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const session = require('express-session');
const backButtonMiddleware = require('./middlewares/backButtonMiddleware');
const  handlebars = require('handlebars');

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

var app = express();

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
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
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

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
  res.render('error', { layout: false });
});

module.exports = app;
