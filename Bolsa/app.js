var express = require('express');
var http = require("http").createServer(express);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');




var app = express();

var io = require('socket.io')(http),
    fs = require('fs'),
    five = require('johnny-five');
http.listen(8080,"localhost");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/node_modules',express.static(path.join(__dirname, 'node_modules')));
app.use('/', routes);


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
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var board = new five.Board();

board.on("ready", function() {
  var servo1 = new five.Servo(2);
  var servo2 = new five.Servo(3);
  var servo3 = new five.Servo(4);

    io.sockets.on('connection', function (socket) {
    socket.on('base', function (data) {
      console.log("Movendo Braco");
      console.log('motor base: ',data.servo1);
      servo1.to(data.servo1);
    });

      socket.on('one', function (data) {
        console.log("Movendo Braco");
        console.log('motor eixo 1: ',data.servo2);
        servo2.to(data.servo2);
      });

      socket.on('two', function (data) {
        console.log("Movendo Braco");
        console.log('motor eixo 2: ',data.servo3);
        servo3.to(data.servo3);
      });





    });



  });

module.exports = app;
