var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session= require('express-session');
var passportConfig = require('./lib/passport');
var databaseConfig = require('./lib/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter =require('./routes/login');
var logoutRouter =require('./routes/logout');
var signupRouter =require('./routes/signup');
var problemRouter =require('./routes/problem');
var rankRouter = require('./routes/rank');
var testRouter = require('./routes/test');
var profileRouter = require('./routes/profile');
var curriculumRouter = require('./routes/curriculum');
var measurementRouter = require('./routes/measurement');
var customRouter = require('./routes/custom');

var app = express();

databaseConfig();
passportConfig();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'@$!#!D1@#', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/problem_imgs', express.static('uploads'));
app.use('/test_imgs', express.static('uploads'));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/users', usersRouter);
app.use('/problem', problemRouter);
app.use('/rank', rankRouter);
app.use('/test', testRouter);
app.use('/profile', profileRouter);
app.use('/curriculum', curriculumRouter);
app.use('/measurement', measurementRouter);
app.use('/custom', customRouter);

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
  res.render('error');
});

module.exports = app;
