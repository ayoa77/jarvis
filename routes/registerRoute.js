var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var walletSchema = mongoose.model('wallet', walletSchema);
var tokenSchema = mongoose.model('token', tokenSchema);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');
// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
};

// var flash = require('express-flash');

// var requireLogin = require('../middleware/requireLogin.js');

router.get('/', function (req, res, next){
    // var lang = req.cookies.lang;
    if (!req.user) {
        error = ' ';
        res.render('register', { error: error, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
    } else {
        res.redirect('/user');
    }
    // res.redirect('/404')
});
router.post('/', function (req, res, next){
    error = ' ';
    req.body.email = req.body.email.toLowerCase();
    req.assert(req.body.email, 'Email is not valid').isEmail();
    req.assert(req.body.email, 'Email cannot be blank').notEmpty();
    req.assert(req.body.password, 'Password cannot be blank and must be between 6 and 20 characters').notEmpty().len(5, 20);
    req.sanitize(req.body.email).normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();
    console.log(req.validationErrors());
    
    if (errors) {
        res.status(400).send(errors);
    
    } else {

    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new userSchema({
        name: req.body.name,
        country: req.body.country,
        email: req.body.email,
        password: hash,
        commitEther: '0',
        status: 'NEW'
    });
    var wallet = new walletSchema({
        userID: user.id,
        wallet: ' '
    });
    user.save(function (err) {
        if (err) {
            error = 'We have experienced an unknown error. Contact us if this persists.';
            if (err.code === 11000) {
                error = 'That email is already taken :(';
            }
            res.render('register', { error: error, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
        } else {
            //set the user's session
            wallet.save(function (err) {
            req.user = user;
            req.session.user = user;
            delete req.user.password;
            res.locals.user = user;

            //create new token
            var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            // Save the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
            //sending token mailer
            // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            //     var transporter = nodemailer.createTransport(sgTransport(options));
            // var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            // transporter.sendMail(mailOptions, function (err) {
            //     if (err) { return res.status(500).send({ msg: err.message }); }
                // res.status(200).send('A verification email has been sent to ' + user.email + '.');

            res.redirect('/user');
            // console.log('going to user');
            // });
            });
            });
            };
        });
    }    
});


module.exports = router;