var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://chadd980:bakura@ds111441.mlab.com:11441/dynamic-voting/?connectTimeoutMS=30000&socketTimeoutMS=300000');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var polls = require('./routes/polls');
// init app
var app = express();


// bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.Header('Access-Control-Allow-Credentials', 'true');
  // res.Header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  // res.Header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  next();
});
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//
//   //and remove cacheing so we get the most recent comments
//   res.setHeader('Cache-Control', 'no-cache');
//   next();
// });

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
  secret: 'anystringoftext',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: db })
}));

app.use(passport.initialize());
app.use(passport.session());

// express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// connect flash
app.use(flash());

// global vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/polls', polls);


app.set('port', (process.env.PORT || 3100));

app.listen(app.get('port'), function(){
  console.log('server connected on port ' + app.get('port'));
});




// module.exports = app;
