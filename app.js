var express = require('express');
var redis = require('redis');
var helmet = require('helmet');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var client = redis.createClient();
// var flash = require('express-flash');
var chalk = require('chalk');
var bcrypt = require('bcryptjs');
var RateLimit = require('express-rate-limit');
var helmet = require('helmet');
var dotenv = require('dotenv');
var fs = require('fs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
app.use(helmet());


// MODELS
fs.readdirSync(__dirname + '/models').forEach(function (filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});
// connect to mongoose - 
var userSchema = mongoose.model('user', userSchema);

// Connect to the db and load env...make sure to uncomment the necessary ones once everyone has the necessary .env.dev file
if ('development' == app.get('env')) {
  // dotenv.load({ path: '.env.dev' });
  console.log('you are running in dev mode');
  // mongoose.connect(`mongodb://localhost/${process.env.MONGO_DB}?socketTimeoutMS=100000`); 
  mongoose.connect(`mongodb://localhost/jarvis?socketTimeoutMS=100000`);
  app.locals.pretty = true;
} else if ('production') {
  // dotenv.load({ path: '.env.prod' });
  console.log("you are running in production");
  mongoose.connect(`mongodb://172.17.0.1/${process.env.MONGO_DB}?socketTimeoutMS=100000`);
  
  // mongoose.connect('mongodb://jarvisAdmin:jarvisPass@localhost/jarvis?authSource=admin')
};



var app = express();

// view engine and express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    client: client,
    ttl: 2600
  }),
  cookieName: 'session',
  secret: '!MysecretisSchwiftyandYours?',
  duration: 30 * 60 * 10000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true, // don't let browser JS access cookie ever
  secure: true, // only use cookies over https
  ephemeral: true // delete this cookie when the browser is closed
}));

// Route that creates a flash message using custom middleware
app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

//middleware for csrf
app.use(csrf());

var indexRoute = require('./routes/indexRoute');
var mailingListRoute = require('./routes/mailingListRoute');
var userRoute = require('./routes/userRoute');
var loginRoute = require('./routes/loginRoute');
var registerRoute = require('./routes/registerRoute');
var walletRoute = require('./routes/walletRoute');
var tokenController = require('./controllers/tokenController');
var passwordController = require('./controllers/passwordController');


app.use('/', indexRoute);
app.use('/user', userRoute);
// app.post('/user', userRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.post('/mailerSignUp', mailingListRoute);
app.use('/wallet', walletRoute);
app.get('/confirmation/:id?', tokenController.confirmationGet);
app.post('/resend', tokenController.resendTokenPost);
app.route('/emailresetpassword')
.get(passwordController.emailResetPasswordGet)
.post(passwordController.emailResetPasswordPost);
app.route('/resetpassword/:id?')
.get(passwordController.passwordResetGet)
.post(passwordController.passwordResetPost);

app.set('port', process.env.PORT || 3000);


// catch 404 and forward to error handler

app.all('/session-flash', function (req, res, next) {
  req.session.sessionFlash = {
    type: 'success',
    message: 'This is a flash message using custom middleware and express-session.'
  }
  res.redirect(301, '/');
});

app.get('/deepdive', function (req, res, next) {
  res.render('deepDive', { title: 'Deep Dive' });
});
app.get('/faq', function (req, res, next) {
  res.render('faq', { title: 'FAQ' });
});
app.get('/governance', function (req, res, next) {
  res.render('governance', { title: 'Governance' });
});
app.get('/whitepaper', function (req, res, next) {
  res.render('whitePaper', { title: 'White Paper' });
});

app.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use((req, res, next) => {
  if (req.session && req.session.user) {
    userSchema.findOne({ email: req.session.user.email }, function (err, user) {
      if (user) {
        req.user = user;
        req.session.user = user;
        res.locals.user = user;
        req.session.user.password = "null";
        req.session.user.passwordResetToken = "null";
        req.session.user.passwordResetExpires = "null";
      }
      next();
    });
  } else {
    next();
  }
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

// app.listen(8000, function () {
// });

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  // console.log(process.env.SESSION_SECRET)
  console.log('  Press CTRL-C to stop\n');
});


module.exports = app;
