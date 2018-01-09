var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
// var flash = require('express-flash');

exports.emailResetPasswordGet = function (req, res) {
    res.render('emailResetPassword', { csrfToken: req.csrfToken() });
};


exports.emailResetPasswordPost = function (req, res) {
    console.log(req.body.email);
    userSchema.findOne({email: req.body.email}, function (err, user) {
        console.log(user);
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        
        user.passwordResetToken = crypto.randomBytes(16).toString('hex');
        user.passwordResetExpires = Date.now() + 90000;
        user.save(function (err) {console.log(user);
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: "ayojamadi@gmail.com", pass: 'testingtester123' } });
            var mailOptions = { from: 'ayojamadi@gmail.com', to: user.email, subject: 'Password Reset', text: 'Hello,\n\n' + 'Please click on the link to reset your password: \nhttp:\/\/' + req.headers.host + '\/resetpassword\/' + user.passwordResetToken + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); 
            }   else   {
                // res.status(200).send('A verification email has been sent to ' + user.email + '.');
                    res.redirect('/'); //{ title: 'verify', message: 'A password email has been sent to ' + user.email + '.' }
                }
            });
        });
    }
)};

exports.passwordResetGet = function (req, res, next) {
    req.session.token = req.params.id;
        res.render('newPassword',{ csrfToken: req.csrfToken() });
        console.log(req.body.token)
        };

exports.passwordResetPost = function (req, res, next) {
    delete req.body.confirm_password;
    // console.log(req)
    userSchema.findOne({ passwordResetToken: req.session.token }, function (err, user) {
        delete req.session.token;
        if (!user) return res.status(400).send({ msg: 'We were unable to find your user information.' });
        if (user.passwordResetExpires < Date.now()) return res.status(400).send({ msg: 'This token has expired, please navigate to forgot your password and restart the process.' });
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        delete req.body.password;
        user.password = hash;
        user.save(function (err) {
            // console.log(user)
            if (err) {
                return res.status(500).send({ msg: err.message }); // res.render('passwordreset',{ csrfToken: req.csrfToken() });
        }else{
            res.redirect('/login');
            }
        });
      
    }
)};

