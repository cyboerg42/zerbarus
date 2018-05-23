var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var vlist = require('./routes/list');
var netinfo = require('./routes/netinfo');
var vstart = require('./routes/start');
var vstop = require('./routes/stop');
var reset = require('./routes/reset');
var info = require('./routes/info');
var vncV = require('./routes/vnc');
var deploy = require('./routes/deploy');
var vdelete = require('./routes/delete');
var getdists = require('./routes/getdists');
var snapshot = require('./routes/snapshot');
var srestore = require('./routes/srestore');
var sremove = require('./routes/sremove');
var screate = require('./routes/screate');
var create = require('./routes/create');
var stats = require('./routes/stats');
var about = require('./routes/about');

var basicAuth = require('express-basic-auth')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
    realm: 'Z3rbaru22'
}))

function myAuthorizer(username, password) {
  var fs = require("fs");
  var crypto = require('crypto');
  var contents = fs.readFileSync("users.json");
  var jsonContent = JSON.parse(contents);
  if(jsonContent[username] == undefined) return false;
  if(jsonContent[username]["password"].toLowerCase() == crypto.createHash('sha256').update(password).digest("hex")) return true;
  else return false;
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', vlist);
app.use('/list', vlist);
app.use('/about', about);
app.use('/stats', stats);
app.use('/create', create);
app.use('/netinfo', netinfo);
app.use('/start', vstart);
app.use('/stop', vstop);
app.use('/reset', reset);
app.use('/info', info);
app.use('/vnc', vncV);
app.use('/deploy', deploy);
app.use('/delete', vdelete);
app.use('/getdists', getdists);
app.use('/snapshot', snapshot);
app.use('/srestore', srestore);
app.use('/sremove', sremove);
app.use('/screate', screate);

app.get('/logout', function (req, res) {
    res.set('WWW-Authenticate', 'Basic realm=Z3rbaru22');
    return res.status(401).send('logoff was successfull...');
});

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
