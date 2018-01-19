var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
// var requireLogin = require('../middleware/requireLogin.js');
// var flash = require('express-flash');

router.get('/', function (req, res) {
    var lang = req.session.locale;
    if (!req.user) {
        res.render('login', { lang: lang, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
    //     console.log(req.session.message);
    //    req.session.message = 'undefined';
    } else {
        res.redirect('/user');
    }
});
router.get('/:id?', function (req, res, next) {
    var id = req.params.id;
    var x;
    if (id == 'false') { x = 'Please Log in' };
    if (!req.user) {
        res.render('login', { error: x, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
        console.log(req.session.message);
        delete req.session.message;
    } else {
        res.redirect('/user');

    }
});
router.post('/', function (req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    userSchema.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            res.render('login', { error: 'invalid email or password', sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;  //set-cookie: session = {email, passwords}
                req.session.cookie.expires = true;
                req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
                delete req.session.user.password;
                if (user.lang){req.session.locale = user.lang};
                res.redirect('/user');
            } else {
    
                res.render('login', { error: 'invalid email or password', sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
            }
        }
    });
});

module.exports = router;