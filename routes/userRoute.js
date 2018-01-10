var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var mongoose = require('mongoose');
var userSchema = mongoose.model('user', userSchema);


router.get('/', csrfProtection, function (req, res, next) {
  console.log(req.session.user);
  if (!req.session.user) {
    res.render('user', { title: 'This comes up when there is no user in the session - LOAD THE LOGIN MODAL' }); //tell the page to drop down the modal
  } else if (typeof req.session.user != 'undefined' && req.session.user.status == 'NEW') {
    res.render('verify', { title: 'Verify' });
  } else {
    res.render('user', { title: 'User', user: req.session.user, csrfToken: req.csrfToken()});
  }
});

///need to add edit logic to this
router.post('/', csrfProtection, function (req, res, next) {
  console.log(req.session.user);
  if (!req.session.user) {
    res.render('user', { title: 'This comes up when there is no user in the session - LOAD THE LOGIN MODAL' }); //tell the page to drop down the modal
  } else if (typeof req.session.user != 'undefined' && req.session.user.status == 'NEW') {
    res.render('verify', { title: 'Verify' });
  } else {
    res.render('user', { title: 'User', user: req.session.user, csrfToken: req.csrfToken() });
  }
});


module.exports = router;
