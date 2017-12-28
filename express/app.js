var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
// var actricle = require('./routes/blogback/actricle.js');
// var add = require('./routes/blogback/add/add.js'); 
// var del = require('./routes/blogback/del/del.js');
// var update = require('./routes/blogback/update/updata');
// var find = require('./routes/blogback/find/find');
var back_api = require('./api/back/app')
var back = require('./api/backChild/api')
var article = require('./api/article/article')
var classlogin = require('./api/class/login')
var frontArtilce=require("./api/front/article")
app.use("/front/article",frontArtilce)
app.use('/back/class',classlogin)
app.use('/back/api',back_api)
app.use('/back/article',article)
app.use('/back/app',back)
app.use('/', index);
// app.use('/actricle', actricle);
// app.use('/add', add); //增
// app.use('/del', del); //删
// app.use('/update', update) //查
// app.use('/find', find);//查
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
