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
// console.log(req.session)
  //  console.log(req.acceptsLanguages('en', 'zh-TW', 'zh', 'jp', 'kr'));
  res.render('index-after', { title: 'Jarvis',
  lang:lang,
  sessionFlash: res.locals.sessionFlash, 
  csrfToken: req.csrfToken() });
});

module.exports = router;
