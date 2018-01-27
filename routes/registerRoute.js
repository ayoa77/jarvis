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
//custome middle ware
var langCheck = require('../middleware/langChecker.js');
var authenticate = require('../middleware/authmiddleware.js');
// send grid api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
};



router.get('/', langCheck, csrfProtection, function (req, res, next){
    // var lang = req.cookies.lang;
    if (!req.user) {
        error = ' ';
        res.render('register', { error: error, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
    } else {
        res.redirect('/user');
    }
    // res.redirect('/404')
});
router.post('/', langCheck, authenticate.register, function (req, res, next){
    req.body.email = req.body.email.toLowerCase()
    const userRegister = new Promise(function (resolve, reject) {
        var error;
    console.log('saving user');
    console.log(req.body);
    

    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new userSchema({
        name: req.body.name,
        lang: req.session.locale || ' ',
        email: req.body.email,
        password: hash,
        commitEther: '0',
        status: 'NEW'
    });
    console.log('saving user')
    user.save(function (err) {
        if (err) {
            error = new Error(lang.errorDefault);
        if (err.code === 11000) {
                error = new Error(lang.errorduplicate_email);
            }
            console.log(error);
        } else {
            console.log('adding user to cookie')
            req.session.user = user;  //set-cookie: session = {email, passwords}
            req.session.cookie.expires = true;
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            delete req.session.user.password;
            console.log('added');
            //create new token
            var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            // Save the verification token
            token.save(function (err) {
                if (err) { error = new Error(lang.errorDefault) }
            //sending token mailer
            var transporter = nodemailer.createTransport(sgTransport(options));
            var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                 if (err) {error = new Error (lang.errorMailerProblem)}
                 // req.session.sessionFlash = {
                     //     type: 'success',
                     //     message: lang.emailverification_email
                     
                     if(!error) {
                         resolve(req.headers.host + '/user');
                     } else {
                         reject(error);
                     }
                    });
                });
            };  
        });        
});   
userRegister
.then(function (response){
    console.log(response)
    console.log('success from route')
  res.send(response);
})
.catch(function errors(err){
    console.log(err)
    console.log('error from route')
    res.send(err);
        })
//  .then((response) => res.redirect('user'));




});

module.exports = router;