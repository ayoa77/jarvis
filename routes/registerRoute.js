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
var validationMiddleware = require('../middleware/validationMiddleware.js');
// send grid api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
};



router.get('/', langCheck, csrfProtection, function (req, res, next){
    // var lang = req.cookies.lang;
    if (!req.session.user) {
        res.render('register', {sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken(), title: 'Jarvis' });
    } else {
        res.redirect('/user');
    }
    // res.redirect('/404')
});

router.post('/', langCheck, validationMiddleware.register, function (req, res, next){
    req.body.email = req.body.email.toLowerCase()
    const userRegister = new Promise(function (resolve, reject) {
        var error; //setting up error variable to be delivered if any errors occur during promise
   
        // setting up new user with variables
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new userSchema({
        name: req.body.name,
        lang: req.session.locale || ' ',
        email: req.body.email,
        password: hash,
        commitEther: '0',
        status: 'NEW'
    });
    console.log('saving user');
    user.save(function (err) {
        if (err) {
            error = lang.errorDefault;
        if (err.code === 11000) {
                error = lang.errorDuplicateEmail;
            }
            console.log(error);
        } else {
            req.session.user = user;  //setting cookie: session = {email, passwords}
            req.session.cookie.expires = true;  // will not delete cookie on browser close
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 1 month cookie
            delete req.session.user.password;  // deleting password from cookie

            //create new token
            var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            
            // Save the verification token
            token.save(function (err) {
                if (err) { error = lang.errorDefault }
           
                //setting up mailer
            var transporter = nodemailer.createTransport(sgTransport(options));
            var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: lang.emailAccountVerificationToken, text: lang.emailHello + ',\n\n' + lang.emailPleaseVerifyAccount + ' \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          
            //stopping mailer if any errors have occured else sending mailer
                if(error) {reject(error) } else {
          
                transporter.sendMail(mailOptions, function (err) {
                if (err) {error = lang.errorMailerProblem;}
          
                //testing to see if errors all passed and moving on after mailer sent
                    if(!error) {
                        var data = {};
                        data.redirect = req.headers.host + '/#modal=email-verify';
                        req.session.sessionFlash = {
                            type: 'message',
                            message: lang.messageVerifyEmailSent
                        }; 
                        resolve(data);
                    } else {
                        reject(error);
                     }
                });
                }
            });
        };  
    });        
});   
    userRegister
    .then(function (response){
        console.log(response)
        req.session.sessionFlash = {
            type: 'keep',
            message: lang.messageVerifyEmailSent
        }; 
        console.log(req.session.sessionFlash);
        console.log('success from route');
    res.send(response);
    })
    .catch(function errors(err){
        // console.log(err)
        // console.log('error from route')
        res.send(err);
    });
});

module.exports = router;