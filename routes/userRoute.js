var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
// var userSchema = mongoose.model('user', userSchema);
// var bcrypt = require('bcryptjs');


router.get('/', function (req, res, next) {
  console.log(req.session.user.status);
  if (!req.session.user) {
    res.redirect('user', { title: 'This comes up when there is no user in the session - LOAD THE LOGIN MODAL' }); //tell the page to drop down the modal
  } else if (typeof req.session.user != 'undefined' && req.session.user.status == 'NEW') {
    res.render('verify', { title: 'Verify' });
  } else {
    res.render('user', { title: 'User', user: req.session.user });
  }
});

module.exports = router;
