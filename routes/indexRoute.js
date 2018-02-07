var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mailingListSchema = mongoose.model('mailingList', mailingListSchema);
var Mailchimp = require('mailchimp-api-v3');
var validator = require('validator');
//DEV API
var mailchimp = new Mailchimp('5e0b4a1b50b66ae689fb23e520122405-us17');
//LIVE API
// var mailchimp = new Mailchimp('mail chimp api from jarvis');
var md5 = require('md5');

langCheck = require('../middleware/langChecker.js');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });



/* GET home page. */
router.get('/', csrfProtection,langCheck, function (req, res, next) {
  if (res.locals.sessionFlash && res.locals.sessionFlash.type == "keep"){
    req.session.sessionFlash = { type: 'message', message: res.locals.sessionFlash.message}
  }
// console.log(req.session)
console.log(res.locals.sessionFlash)
  //  console.log(req.acceptsLanguages('en', 'zh-TW', 'zh', 'jp', 'kr'));
  console.log(req.session.user);
  res.render('index', { title: 'Jarvis',
  lang:lang,
  sessionFlash: res.locals.sessionFlash, 
  user: req.session.user,
  csrfToken: req.csrfToken() });

});

module.exports = router;
