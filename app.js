var express = require('express');
var app = express();
var mongoose = require('mongoose');
var redis = require('redis');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var client = redis.createClient();
var chalk = require('chalk');
var bcrypt = require('bcryptjs');
var RateLimit = require('express-rate-limit');
var helmet = require('helmet');
var dotenv = require('dotenv');
var fs = require('fs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var i18n = require('i18n-2');
var validator = require("express-validator");
var iplocation = require('iplocation');
var nodemailer = require('nodemailer');
var promise = require('bluebird')



langCheck = require('./middleware/langChecker.js');
validationMiddleware = require('./middleware/validationMiddleware.js');


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
  console.log("you are running production Mongo");
  mongoose.connect(`mongodb://172.17.0.1/jarvis?socketTimeoutMS=100000`);
  // mongoose.connect('mongodb://jarvisAdmin:jarvisPass@localhost/jarvis?authSource=admin')
};

// Attach the i18n property to the express request object
// And attach helper methods for use in templates

// i18n.expressBind(app, {
//   directory: "./middleware/backups/locales",

//   extension: '.json',
//   // setup some locales - other locales default to en silently
//   locales: ['en', 'zh-TW', 'zh-CN', 'ja', 'ko'],
//   // change the cookie name from 'lang' to 'locale'
//   cookieName: 'locale'
// });

app.use(helmet());

app.use(validator({
  customValidators: {
    isEmailAvailable: function (email) {
      return new Promise(function (resolve, reject) {
        userSchema.findOne({ 'email': email }, function (err, results) {
          if(email == '') {
            reject(results);
          }
          else if (results != null) {
            console.log(results)
            reject(results);
            console.log(err);
          }
          return resolve(err);
        });
      });
    }
  }
}));
// view engine and express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
if ('development' == app.get('env')) {
  app.use(session({
    store: new RedisStore({
      host: 'localhost',
      port: 6379,
      client: client,
      ttl: 2600
    }),
    cookieName: 'session',
    secret: '!MysecretisSchwiftyandYours?',
    // duration: 30 * 60 * 10000,
    // activeDuration: 5 * 60 * 1000,
    maxAge: 30 * 24 * 60 * 60000,
    httpOnly: true, // don't let browser JS access cookie ever
    secure: true, // only use cookies over https
    // ephemeral: true // delete this cookie when the browser is closed
  }));
} else if ('production' == app.get('env')) {
  console.log("you are running production Redis");
  app.use(session({
    store: new RedisStore({
      host: '172.17.0.1',
      port: 6379,
      client: client,
      ttl: 2600
    }),
    cookieName: 'session',
    secret: '!MysecretisSchwiftyandYours?',
    // duration: 30 * 60 * 10000,
    // activeDuration: 5 * 60 * 1000,
    maxAge:  30 * 24 * 60 * 60000,
    httpOnly: true, // don't let browser JS access cookie ever
    secure: true, // only use cookies over https
    // ephemeral: true // delete this cookie when the browser is closed
  }));
}

// app.use(function (req,res,next) {


// })
app.use(function (req, res, next) {
  if (!req.session.locale) { req.session.locale = req.acceptsLanguages('en', 'zh-TW', 'zh-CN', 'jp', 'kr') || 'en' }
  if (req.session && req.session && req.session.user && req.session.user.lang != ' ') { req.session.locale = req.session.user.lang }
  // req.i18n.setLocaleFromSessionVar();
  next();
});

app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

var indexRoute = require('./routes/indexRoute');
var mailingListRoute = require('./routes/mailingListRoute');
var userRoute = require('./routes/userRoute');
var loginRoute = require('./routes/loginRoute');
var registerRoute = require('./routes/registerRoute');
var languageRoute = require('./routes/languageRoute');
// var walletRoute = require('./routes/walletRoute');
var tokenController = require('./controllers/tokenController');
var passwordController = require('./controllers/passwordController');


app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.post('/mailerSignUp', mailingListRoute);
// app.use('/wallet', walletRoute);
app.post('/language', languageRoute);
app.get('/confirmation/:id?', langCheck, tokenController.confirmationGet);
app.post('/resend',langCheck, tokenController.resendTokenPost);
app.route('/emailresetpassword')
  .get(csrfProtection, langCheck, passwordController.emailResetPasswordGet)
  .post(langCheck, passwordController.emailResetPasswordPost);
app.route('/resetpassword/:id?')
  .get(csrfProtection, langCheck, passwordController.passwordResetGet)
  .post(langCheck, validationMiddleware.password, passwordController.passwordResetPost);

app.set('port', process.env.PORT || 3000);

app.all('/session-flash', function (req, res, next) {
  req.session.sessionFlash = {
    type: 'success',
    message: 'This is a flash message using custom middleware and express-session.'
  }
  res.redirect(301, '/');
});

app.get('/technology', csrfProtection, langCheck, function (req, res, next) {
  res.render('deepDive', { title: 'Technology', sessionFlash: res.locals.sessionFlash, lang:lang,csrfToken: req.csrfToken() });
});
app.get('/faq', csrfProtection, langCheck, function (req, res, next) {
  res.render('faq', { title: 'FAQ', sessionFlash: res.locals.sessionFlash, lang:lang, csrfToken: req.csrfToken() });
});
app.get('/governance', csrfProtection, langCheck, function (req, res, next) {
  res.render('governance', { title: 'Governance', sessionFlash: res.locals.sessionFlash, lang:lang, csrfToken: req.csrfToken() });
});
app.get('/whitepaper', csrfProtection, langCheck, function (req, res, next) {
  res.render('whitePaper', { title: 'White Paper', sessionFlash: res.locals.sessionFlash, lang:lang, csrfToken: req.csrfToken() });
});
app.get('/testing', langCheck, function (req, res) {
  iplocation('56.70.97.8')
    .then(result => {  
      console.log(result.country_name);
      res.send(JSON.stringify);
    })
    .catch(err => {
      console.error(err)
    })
  // res.render('testing');
});

//AJAXING Location look up
app.post('/startup', function (req, res, next) {
  // req.session.loc = null;
    if (!req.session.loc) {
  iplocation(req.ip)
    .then(result => {
      req.session.loc = result.country_name
      console.log(req.ip)
      res.send(req.session.loc);
    })
      .catch(err => {
        console.error(err)
        res.send(err)
      })  
    }else{res.send('ok')}
  });

//LEAVING AFTER BEING PRESENTED WITH EULA,
app.get('/leave', function (req, res, next) {
  res.redirect('/');
});

//LOGING OUT AND DESTROYING SESSION
app.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

// robots.txt config
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /user \nDissalow: /logout \nDissalow: /confirmation \nDissalow: /emailresetpassword");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { sessionFlash: res.locals.sessionFlash });
});

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});


module.exports = app;
