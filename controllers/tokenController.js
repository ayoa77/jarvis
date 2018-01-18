var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var tokenSchema = mongoose.model('token', tokenSchema);
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');
var validator = require('express-validator')

// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
}
// var flash = require('express-flash');
/**
* GET /confirmation
*/
exports.confirmationGet = function  (req, res, next) {
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('email', 'Email cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ remove_dots: false });
    // req.assert('token', 'Token cannot be blank').notEmpty(); "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"

    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    // Delete cookie to make edits to user and to make sure they have to login again
    delete req.session.user;
    // Find a matching token
    console.log(req.params.id)
    tokenSchema.findOne({ token: req.params.id }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token may have expired.' });

        // If we found a token, find a matching user
        userSchema.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.status != 'NEW') return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

          
            // Verify and save the user
            console.log(user);
            user.status = 'EMAIL'
            user.save(function (err) {
                console.log(user);
                if (err) { return res.status(500).send({ msg: err.message }); }
                // res.status(200).send("The account has been verified. Please log in.");
                req.session.message = "The account has been verified. To complete this process, please log in."
                res.redirect('/login');
            });
        });
    });
};

/**
* POST /resend
*/
exports.resendTokenPost = function  (req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);

    userSchema.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport(sgTransport(options));
            var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                // res.status(200).send('A verification email has been sent to ' + user.email + '.');
                res.render('verify', { title: 'verify', message: 'A verification email has been sent to ' + user.email + '.', sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
            });
        });

    });
};
