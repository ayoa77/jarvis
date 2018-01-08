var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var tokenSchema = mongoose.model('token', tokenSchema);
var crypto = require('crypto');
var nodemailer = require('nodemailer');
/**
* GET /confirmation
*/
exports.confirmationGet = function (req, res, next) {
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('email', 'Email cannot be blank').notEmpty();
    // req.assert('token', 'Token cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors    
    // var errors = req.validationErrors();
    // if (errors) return res.status(400).send(errors);
    // Delete cookie to make edits to user and to make sure they 
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
exports.resendTokenPost = function (req, res, next) {
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('email', 'Email cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors    
    // var errors = req.validationErrors();
    // if (errors) return res.status(400).send(errors);

    userSchema.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user:"ayojamadi@gmail.com", pass: 'testingtester123' } });
            var mailOptions = { from: 'ayojamadi@gmail.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                // res.status(200).send('A verification email has been sent to ' + user.email + '.');
                res.render('verify', { title: 'verify' , message: 'A verification email has been sent to ' + user.email + '.'});
            });
        });

    });
};