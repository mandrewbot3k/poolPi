var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var onoff = require('onoff').Gpio;
var configFile = require('./data/config.json');
//var myschedules = require('./data/node-schedule.js');
//var io = require('socket.io');
//var Gpio = require('onoff').Gpio;

//routes
var indexRouter = require('./routes/index');
var statusRouter = require('./routes/status');
var usersRouter = require('./routes/users');
var settingsRouter = require('./routes/settings');
var schedulerRouter = require('./routes/scheduler');
var controlsRouter = require('./routes/controls');

app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//views
app.use('/', indexRouter);
app.use('/status', statusRouter)
app.use('/users', usersRouter);
app.use('/settings', settingsRouter);
app.use('/scheduler', schedulerRouter)
app.use('/controls', controlsRouter)

// Set global app variables from data/config.json
app.locals.siteTitle = configFile.appTitle;
app.locals.city = configFile.poolinfo.city;
app.locals.bootswatch = configFile.bs.bootswatch;
app.locals.bgColor = configFile.bs.bg;
app.locals.navbarColor = configFile.bs.navbar;

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
