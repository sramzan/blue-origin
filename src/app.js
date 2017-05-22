// Definining modules to be used
var express      = require('express'),
    path         = require('path'),
    cors        = require('cors'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser');

// Defining routes
var index = require('./server/routes/index'),
    users = require('./server/routes/users');

// Defining the express app
var app = express();
app.use(cors());

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next()
// });

// view engine setup
app.set('views', path.join(__dirname, 'ui/templates'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'ui/common')));
app.use(express.static(path.join(__dirname, 'ui/css')));
app.use(express.static(path.join(__dirname, 'ui/js')));
app.use(express.static(path.join(__dirname, 'ui/templates')));

// Node modules that will be used in the app (i.e. AngularJS)
app.use(express.static(path.join(__dirname, '../node_modules')));
app.use(express.static(path.join(__dirname, '../node_modules/angular')));
app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-router')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap')));
app.use(express.static(path.join(__dirname, '../node_modules/jquery')));
app.use(express.static(path.join(__dirname, '../node_modules/animate.css')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
