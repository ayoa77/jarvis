var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mailingListSchema = mongoose.model('mailingList', mailingListSchema);
// var flash = require('express-flash');
var Mailchimp = require('mailchimp-api-v3');
var validator = require('validator');
//DEV API
var mailchimp = new Mailchimp('5e0b4a1b50b66ae689fb23e520122405-us17');
//LIVE API
// var mailchimp = new Mailchimp('mail chimp api from jarvis');
var md5 = require('md5');



/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log(req.acceptsLanguages('en', 'zh-TW', 'zh', 'jp', 'kr'));
  console.log(req.session);
  console.log(res.locals.sessionFlash)
  res.render('index', { title: 'Jarvis', sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
});

module.exports = router;
