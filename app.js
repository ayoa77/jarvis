var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var chalk = require('chalk');
var bcrypt = require('bcryptjs');
var RateLimit = require('express-rate-limit');
var helmet = require('helmet');
var fs = require('fs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });


// MODELS
fs.readdirSync(__dirname + '/models').forEach(function (filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});
// connect to mongoose - 
var userSchema = mongoose.model('user', userSchema);

// Connect to the db
// if ('development' == app.get('env')) {
  // console.log('you are running in dev mode');
  mongoose.connect('mongodb://localhost/jarvis?socketTimeoutMS=100000');
  // app.locals.pretty = true;
// } else if ('production') {
//   console.log("you are running in production");
//   mongoose.connect('mongodb://172.17.0.1/jarvis?socketTimeoutMS=100000');

  // mongoose.connect('mongodb://jarvisAdmin:jarvisPass@localhost/jarvis?authSource=admin')
// };



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
  cookieName: 'session',
  secret: '!MysecretisSchwiftyandYours?',
  duration: 30 * 60 * 10000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true, // don't let browser JS access cookie ever
  secure: true, // only use cookies over https
  ephemeral: true // delete this cookie when the browser is closed
}));


var indexRoute = require('./routes/indexRoute');
var userRoute = require('./routes/userRoute');
var loginRoute = require('./routes/loginRoute');
var registerRoute = require('./routes/registerRoute');
var tokenController = require('./controllers/tokenController');
var passwordController = require('./controllers/passwordController');

app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.get('/confirmation/:id?', tokenController.confirmationGet);
app.post('/resend', tokenController.resendTokenPost);
app.route('/emailresetpassword')
  .get(csrfProtection, passwordController.emailResetPasswordGet)
  .post(csrfProtection, passwordController.emailResetPasswordPost);
app.route('/resetpassword/:id?')
  .get(csrfProtection, passwordController.passwordResetGet)
  .post(csrfProtection, passwordController.passwordResetPost);

app.set('port', process.env.PORT || 3000);
// catch 404 and forward to error handler


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
  req.session.reset();
  res.redirect('/');
});

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

// app.listen(8000, function () {
// });

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
//   console.log(process.env.SESSION_SECRET)
  console.log('  Press CTRL-C to stop\n');
});


module.exports = app;
