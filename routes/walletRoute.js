//need to place wallet logic here
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });



module.exports = router;