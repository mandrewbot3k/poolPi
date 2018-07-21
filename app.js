require('console-stamp')(console, 'mm/dd/yy HH:MM:ss');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var configFile = require('./data/config.json');
var io = require('socket.io');
var myschedules = require('./data/node-schedule');
const chokidar = require('chokidar');

//routes
var indexRouter = require('./routes/index');
var controlsRouter = require('./routes/controls');
var usersRouter = require('./routes/users');
var settingsRouter = require('./routes/settings');
var schedulerRouter = require('./routes/scheduler');
var deviceRouter = require('./routes/devices');
var gpioAPI = require('./routes/gpio');

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
app.use('/controls', controlsRouter)
app.use('/users', usersRouter);
app.use('/settings', settingsRouter);
app.use('/schedules', schedulerRouter);
app.use('/devices', deviceRouter);
app.use('/gpio', gpioAPI);

// Set the setTimers
var poolTimer = ()=>{
  myschedules.cancelTimers();
  myschedules.setTimers();
};
poolTimer();

// Watch the timer schedule and update the timers on change
var schWatcher = chokidar.watch('./data/schedule.json',{awaitWriteFinish: true, usePolling: false});

schWatcher.on('change',()=>{
  console.log("Schedule Changed");
  poolTimer();
})


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
