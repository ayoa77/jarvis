var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
// var requireLogin = require('../middleware/requireLogin.js');

router.get('/', function (req, res) {
    // var lang = req.cookies.lang;
    if (!req.user) {
        error = ' ';
        // res.render('register', { lang: lang, error: error });
        res.render('register', { error: error });
    } else {
        res.redirect('/user');
    }
    // res.redirect('/404')
});
router.post('/', function (req, res) {
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new userSchema({
        email: req.body.email,
        password: hash
    });
    user.save(function (err) {
        if (err) {
            error = 'something else happened';
            if (err.code === 11000) {
                error = 'That email is already taken :(';
            }
            res.render('register', { error: error });
        } else {
            //set the user's session
            req.user = user;
            req.session.user = user;
            delete req.user.password;
            res.locals.user = user;
            res.redirect('/user');
            console.log('going to user');
        }
    });
});

module.exports = router