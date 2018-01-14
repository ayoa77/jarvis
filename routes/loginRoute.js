var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
// var requireLogin = require('../middleware/requireLogin.js');
// var flash = require('express-flash');

router.get('/', function (req, res) {
    var lang = req.cookies.lang;
    if (!req.user) {
        res.render('login', { lang: lang, csrfToken: req.csrfToken(), message: req.session.message });
        console.log(req.session.message);
       req.session.message = 'undefined';
    } else {
        res.redirect('/user');
    }
});
router.get('/:id?', function (req, res, next) {
    var id = req.params.id;
    var x;
    if (id == 'false') { x = 'Please Log in' };
    if (!req.user) {
        res.render('login', { error: x, csrfToken: req.csrfToken(), message: req.session.message  });
        console.log(req.session.message);
        delete req.session.message;
    } else {
        res.redirect('/user');

    }
});
router.post('/', function (req, res, next) {
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