var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var tokenSchema = mongoose.model('token', tokenSchema);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');
var csrf = require('csurf'); 
var csrfProtection = csrf({ cookie: true });
var validator = require("express-validator");
var authenticate = require('../middleware/authmiddleware.js');
// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
};

function isEmailAvailable(email) {
    return new Promise(function (resolve, reject) {
        userSchema.findOne({ 'email': email }, function (err, results) {
            if (err) {
                return resolve(err);
            }
            reject(results);
        });
    });
}


router.get('/', csrfProtection, function (req, res, next){
    // var lang = req.cookies.lang;
    if (!req.user) {
        error = ' ';
        res.render('register', { error: error, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
    } else {
        res.redirect('/user');
    }
    // res.redirect('/404')
});
router.post('/', authenticate.register, function (req, res, next){

    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new userSchema({
        name: req.body.name,
        lang: req.session.locale || ' ',
        email: req.body.email,
        password: hash,
        commitEther: '0',
        status: 'NEW',
        wallet: 'blank'
    });
    user.save(function (err) {
        if (err) {
            error = __('error.default');
        if (err.code === 11000) {
                error = __('error.duplicate_email');
            }
            console.log(error);
        } else {

            //create new token
            var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            // Save the verification token
            token.save(function (err) {
                if (err) { return res.send({ msg: err.message }); }
            //sending token mailer
            var transporter = nodemailer.createTransport(sgTransport(options));
            var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.send({ msg: err.message }); }
                return  res.status(200).send(__('email.verification_email'));
                // req.session.sessionFlash = {
                //     type: 'success',
                //     message: __('email.verification_email')
            
            });
            });
        };  
        });        
});     

module.exports = router;