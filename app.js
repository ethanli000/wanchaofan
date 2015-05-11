var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var front = require('./routes/front');
var cover = require('./routes/cover');
var photo = require('./routes/photo');
var bio = require('./routes/bio');

var admin = require('./routes/admin');
var admin_series = require('./routes/admin_series');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'wanchaofan', resave: false, saveUninitialized: true}));
app.use(require("stylus").middleware({
  src: __dirname + "/public",
  compress: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.makeUrl = function (str) {
    return String(str).replace(/\s+/g, '-').toLowerCase();
  };
  next();
});

app.use('/', front);
app.use('/index', cover);
app.use('/photo', photo);
app.use('/bio', bio);
app.use('/admin', admin);
app.use('/admin/series', admin_series);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
  res.render('404', { title: 'Wan Chaofan - NOT FOUND' });
});


module.exports = app;
