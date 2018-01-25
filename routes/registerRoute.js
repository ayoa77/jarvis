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
// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
};


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
router.post('/', function (req, res, next){
    // This will validate the information written by the user to register   
    req.body.email = req.body.email.toLowerCase();
    req.check('email', __('error.email_format_incorrect')).isEmail();
    req.check('name', __('error.name_blank')).notEmpty();
    req.check('email', __('error.email_blank')).notEmpty();
    req.check('password', __('error.password_format_incorrect')).notEmpty().len(5, 20).matches(/^(?=.*\d)/); 
    req.check('email', __("error.duplicate_email")).isEmailAvailable();  //uses custom validator from app.js to check if an email is available 

     req.asyncValidationErrors().catch(function (errors) {
        if (errors) {
            console.log(errors)
            return res.send(errors);
     };
     return req.body;
    }).then( function(body) {
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new userSchema({
        name: body.name,
        country: body.country,
        lang: req.session.locale || ' ',
        email: body.email,
        password: hash,
        commitEther: '0',
        status: 'NEW',
        wallet: 'wallets'
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
                // }
            
            });
            });
        };  
        });    
});    
});     

module.exports = router;