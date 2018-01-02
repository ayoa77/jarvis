var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
// var bcrypt = require('bcryptjs');


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('this is where a users account will be - change this method to res.require once you arrive here');
// });

router.get('/', function (req, res, next) {
  res.render('user', { title: 'Jarvis' });
});

module.exports = router;
