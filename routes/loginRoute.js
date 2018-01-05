var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var requireLogin = require('../middleware/requireLogin.js');

router.get('/', csrfProtection, function (req, res) {
    var lang = req.cookies.lang;
    if (!req.user) {
        res.render('login', { lang: lang, csrfToken: req.csrfToken() });
    } else {
        res.redirect('/user');
    }
});
router.get('/:id?', csrfProtection, function (req, res) {
    var id = req.params.id;
    var x;
    if (id == 'false') { x = 'Please Log in' };
    if (!req.user) {
        res.render('login', { error: x, csrfToken: req.csrfToken() });
    } else {
        res.redirect('/user');
    }
})
router.post('/', csrfProtection, function (req, res) {
    userSchema.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            res.render('login', { error: 'invalid email or password', csrfToken: req.csrfToken() });
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;  //set-cookie: session = {email, passwords}
                delete req.session.user.password;
                res.redirect('/user');
            } else {
                res.render('login', { error: 'invalid email or password', csrfToken: req.csrfToken() });
            }
        }
    });
});

module.exports = router;