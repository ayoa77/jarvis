var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var tokenSchema = mongoose.model('token', tokenSchema);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

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
        password: hash,
        status: 'NEW'
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

            //create new token
            var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            console.log(token)
            // Save the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
            //sending token mailer
            // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: 'ayojamadi@gmail.com', pass: 'testingtester123' } });
            var mailOptions = { from: 'ayojamadi@gmail.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                // res.status(200).send('A verification email has been sent to ' + user.email + '.');

            res.redirect('/user');
            console.log('going to user');
            });
        });
        }
    });
});

module.exports = router