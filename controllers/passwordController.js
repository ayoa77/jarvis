var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
}
// var flash = require('express-flash');

exports.emailResetPasswordGet = function (req, res) {
};


exports.emailResetPasswordPost = function (req, res) {
    var error; //to capture errors to be thrown on non-important funtions
    req.body.email = req.body.email.toLowerCase();
    const userSetter = new Promise(function (resolve, reject) {
    
        userSchema.findOne({email: req.body.email}, function (err, user) {
            if (!user) { reject(lang.errorNoEmailFound); } else {
        //setting password reset token and expiration
        user.passwordResetToken = crypto.randomBytes(16).toString('hex');
        user.passwordResetExpires = Date.now() + 900000;
        user.save(function (err) {
            if (err) { reject(lang.errorDefault); 
            } else { resolve(user) }
        });
            }
        });
    });
    function passwordTokenSender(user) {
        return new Promise( function (resolve, reject) {
            // shouldn't get here if there is not user, but testing just to be safe.
            if (!user) {reject(lang.errorNoEmailFound);
            } else {
            // Send email
            var transporter = nodemailer.createTransport(sgTransport(options));
            var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: lang.emailPasswordReset, text: lang.emailHello + ',\n\n' + lang.emailPleaseResetPassword + ' \nhttp:\/\/' + req.headers.host + '\/resetpassword\/' + user.passwordResetToken + '#modal=pass-reset' };

            //  transporter.sendMail(mailOptions, function (err) {
                 if (err) { reject(lang.errorDefault) } else {

                if (!error) {
                    //data has to be set after the resolving of the promise here
                    var data = {};
                    // data.redirect = req.headers.host + '/#modal=login',
                    // data.message = lang.messagePasswordResetEmailSent                    
                    resolve(data);
                } else {
                    reject(error);
                }
                 }
            //  });
            }
        })
    }
    
        userSetter
            .then(user => {
                console.log('success from user route');
                passwordTokenSender(user);
            }).then(data => {
                var data = {};
                data.redirect = req.headers.host + '/#modal=login',
                data.message = lang.messagePasswordResetEmailSent,
                req.session.sessionFlash = {
                    type: 'message',
                    message: lang.messagePasswordResetEmailSent
                },         
                console.log('success from route');
                res.send(data);
            }).catch(err => {
                console.log(err);
                console.log('error from route');
                res.send(err);
            });


};

//FORM WITH TWO PASSWORD FIELDS TO CHANGE PASSWORD
exports.passwordResetGet = function (req, res, next) {
    req.session.token = req.params.id;
    res.redirect('/#modal=pass-reset');
};

//FORM WITH TWO PASSWORD FIELDS TO CHANGE PASSWORD
exports.passwordResetPost = function (req, res, next) {
    // req.checkBody('password', `Password cannot be blank, must be between 6 and 20 characters, and have at least one number <%= req.i18n.__('passwords-format-incorrect') %>`).notEmpty().len(5, 20).matches(/^(?=.*\d)/); 
    // req.checkBody('confirm_password', `Passwords do not match.<%= req.i18n.__('passwords-dont-match') %>`).equals(req.body.password);
    // var errors = req.validationErrors();
    // if (errors) {
    //     console.log(errors)
    //     res.send(errors);
    //     return;
    // } else {
    var data = {}
    delete req.body.password2;
    const passwordReset = new Promise(function (resolve, reject) {
    // console.log(req)
    userSchema.findOne({ passwordResetToken: req.session.token }, function (err, user) {
        delete req.session.token;
        console.log(req.session.token);
        if (!user) {
            data.failure = req.headers.host + '/#modal=login';
            data.message = lang.errorNoUserFound;
            req.session.sessionFlash = {
                type: 'error',
                message: lang.errorNoUserFound
            }
            reject(data); 
        } else {
            if (user.passwordResetExpires < Date.now()) { 
                data.failure = req.headers.host + '/#modal=login';
                data.message = lang.messagePasswordTokenExpired;
                req.session.sessionFlash = {
                    type: 'message',
                    message: lang.messagePasswordTokenExpired
                }; 
                reject(data); } else {
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        delete req.body.password;
        user.password = hash;
        user.save(function (err) {
            // console.log(user)
            if (!err) {
                var data = {};
                data.redirect = req.headers.host + '/#modal=login';
                data.message = lang.messageResetSuccessful;
                resolve(data);
            } else {
                reject(lang.errorDefault);
            }
            }
    )};
      
    }
});
});
    passwordReset
        .then(function (response) {
            console.log(response)
            console.log('success from route')
            res.send(response);
        })
        .catch(function errors(err) {
            console.log(err)
            console.log('error from route')
            res.send(err);
        });
};

