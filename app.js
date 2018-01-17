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
var flash = require('express-flash');
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
  mongoose.connect(`mongodb://172.17.0.1/${process.env.MONGO_DB}?socketTimeoutMS=100000`);
  
  // mongoose.connect('mongodb://jarvisAdmin:jarvisPass@localhost/jarvis?authSource=admin')
};




app.use(helmet());

app.use(validator());
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
    duration: 30 * 60 * 10000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true, // don't let browser JS access cookie ever
    secure: true, // only use cookies over https
    ephemeral: true // delete this cookie when the browser is closed
  }));
}else if ('production' == app.get('env')) {
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
    duration: 30 * 60 * 10000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true, // don't let browser JS access cookie ever
    secure: true, // only use cookies over https
    ephemeral: true // delete this cookie when the browser is closed
  }));
}
// Route that creates a flash message using custom middleware
app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

//middleware for csrf
app.use(csrf());
//middleware updating user throughout project
  app.use(function(req, res, next) {
    if (req.session && req.session.user) {
      userSchema.findOne({ _id: req.session.user.id }, function (err, user) {
        if (user) {
          console.log(user);
          req.user = user;
          req.session.user.commitEther = user.commitEther || ' ' ;
          req.session.user._id = user._id;
          req.session.user.name = user.name;
          req.session.user.country = user.country;
          req.session.user.email = user.email;
          res.locals.user = req.session.user;
        }
        next();
      });
    } else {
      next();
    }
  });

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

// Attach the i18n property to the express request object
// And attach helper methods for use in templates
i18n.expressBind(app, {
  // setup some locales - other locales default to en silently
  locales: ['en', 'zh-TW', 'zh-CN', 'ja', 'ko'],
  // change the cookie name from 'locale' to 'lang'
  cookieName: 'locale'
});

// TODO ---- Find Users country via IP and compare with 

// This is how you'd set a locale from req.cookies.
// Don't forget to set the cookie either on the client or in your Express app.
app.use(function (req, res, next) {
  if (req.session && req.session.user && req.session.user.lang) {
    userSchema.findOne({ _id: req.session.user._id }, function (err, user) {
    
    lang = user.lang;
   
    });
    console.log('----------------------------------------------')
    // console.log(req.headers["accept-language"]);
    console.log('final language is: ' + lang);
    console.log('----------------------------------------------')
  } else if(res.locals.locale != " "){
    lang = res.locals.locale;
    
    // } else if (logic for country will go here){
    }
    
    if (lang) {
      
    } else {
      var accepted_language = req.acceptsLanguages('en', 'zh-TW', 'ja', 'ko', 'zh-CN');
  lang = accepted_language;
    console.log('None of [fr, es, en] is accepted');

  }
  // console.log(req.i18n);
  // console.log(req.cookies.locale) //=> 'de'
  // console.log(req.i18n.locale);
  // console.log(req.acceptsLanguages('en', 'zh-TW', 'zh', 'jp', 'kr'));
  // req.i18n.setLocaleFromCookie();
  req.i18n.setLocale(lang);
  res.locals.locale = lang;


  next();
});

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
  res.render('deepDive', { title: 'Deep Dive', sessionFlash: res.locals.sessionFlash });
});
app.get('/faq', function (req, res, next) {
  res.render('faq', { title: 'FAQ', sessionFlash: res.locals.sessionFlash });
});
app.get('/governance', function (req, res, next) {
  res.render('governance', { title: 'Governance', sessionFlash: res.locals.sessionFlash });
});
app.get('/whitepaper', function (req, res, next) {
  res.render('whitePaper', { title: 'White Paper', sessionFlash: res.locals.sessionFlash });
});
app.get('/testing', function (req, res) {
    console.log(res.locale); // en
    console.log(req.locale); // ja
    console.log(res.locals); // { locale: en, /* ... */ }
  res.send(req.i18n.__('Language'));
});

app.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});
// robots.txt config
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /user \nDissalow: /logout \nDissalow: /confirmation \nDissalow: /emailresetpassword");
});
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.get('/accepted-languages', function (req, res) {

});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
});

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});


module.exports = app;
