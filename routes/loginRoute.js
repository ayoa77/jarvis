var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
var iplocation = require('iplocation');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
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
router.get('/:id?', csrfProtection, function (req, res, next) {
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
router.post('/', csrfProtection, function (req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    userSchema.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            res.render('login', { error: 'invalid email or password', sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;  //set-cookie: session = {email, passwords}
                req.session.cookie.expires = true;
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
                delete req.session.user.password;
                if (user.lang){req.session.locale = user.lang}
                iplocation(req.ip, function (error, result) {
                    c = result.country_name
                    // if(user.status == 'EULA'){res.redirect('/user')};
                    if(c != "United States" && c!= "China" && c!= "Republic of Korea") {
                        res.redirect('/user');
                    } else {
                        res.redirect('/user?modal=restricted-country')
                    }
                });
            } else {
                res.send('modal-login');
            }
        }
    });
});

module.exports = router;