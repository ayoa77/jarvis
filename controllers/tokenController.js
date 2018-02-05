var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var tokenSchema = mongoose.model('token', tokenSchema);
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');
var validator = require('express-validator');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var promise = require('bluebird');

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
    // Find a matching token //// AJAX THIS STUFF AJ TODO
    data = {};
    tokenSchema.findOne({ token: req.params.id }, function (err, token) {
        if (!token) {
            console.log(req.params.id)

            req.session.sessionFlash = {
                type: 'message',
                message: lang.errorNoUserFound
            },
                res.redirect('/#modal=email-verify');
            return;
        }
        // If we found a token, find a matching user
        userSchema.findOne({ _id: token._userId }, function (err, user) {
            if (!user) 
                {

                    req.session.sessionFlash = {
                        type: 'message',
                        message: lang.errorNoUserFound
                    },
                        res.redirect('/#modal=email-verify');
                    return;
                }
            if (user.status != 'NEW'){ 

                req.session.sessionFlash = {
                    type: 'message',
                    message: lang.errorAlreadyVerified
                },       
              res.redirect('/#modal=login');
              return;
            }
            
            // Verify and save the user
            console.log(user);
            user.status = 'EMAIL'
            user.save(function (err) {
                console.log(user);
                if (err) { return res.status(500).send({ msg: err.message }); }
                // Delete cookie to make edits to user and to make sure they have to login again
                delete req.session.user;
                req.session.sessionFlash = {type: "message", message: lang.messageEmailVerified}
                // res.status(200).send("The account has been verified. Please log in.");
                res.redirect('/#modal=login');

            });
        });
    });
};

/**
* POST /resend
*/

exports.resendTokenPost = function  (req, res, next) {
    var error; //to capture errors to be thrown on non-important funtions
    req.body.email = req.body.email.toLowerCase();
    const userFinder = new Promise(function (resolve, reject) {
        
        userSchema.findOne({ email: req.body.email }, function (err, user) {
            if (!user) {reject(lang.errorNoEmailFound);}
            if (user && user.status != 'NEW') {reject(lang.errorAlreadyVerifiedAccount);
        }else{ resolve(user)}
        });
    });

    function tokenSender(user){
        return new Promise(
            function (resolve, reject) {
            // shouldn't get here if there is not user, but testing just to be safe.
            if (!user) {reject(lang.errorNoEmailFound)
            }else{
        // Create a verification token, save it, and send email
        var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        
        // Save the token
        token.save(function (err) {
            
            // No email if there are errors - this save will be dependent on all the previous functions, so it will catch all of the errors here
            if (err) {reject(lang.errorDefault)} else {
            
            // Send email
            var transporter = nodemailer.createTransport(sgTransport(options));
            var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: lang.emailAccountVerificationToken, text: lang.emailHello + ',\n\n' + lang.emailPleaseVerifyAccount + ' \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) {reject(lang.errorDefault)}

                if (!error) {
                        var data = {};
                        data.redirect = req.headers.host + '/user';
                        data.message = lang.messageVerifyEmailSent;
                        req.session.sessionFlash = { type: "message", message: lang.messageEmailVerified }
                        console.log(data)
                        resolve(data);
                    } else {
                        reject(error);
                    }
            });
            }
        });
        }
            }); 
    }  



    userFinder
        .then(user=> {
            console.log('success from user route')
             tokenSender(user);
        }).then(data=> {
            console.log(data)
            var data = {};
            // req.session.sessionFlash = { type: "message", message: lang.messageEmailVerified }
            data.redirect = req.headers.host + '/user';
            data.message = lang.messageVerifyEmailSent;
            console.log('success from route')
            res.send (data)
        }).catch((err => {
            console.log(err)
            console.log('error from route')
            res.send(err);
        }))
    
};



// exports.confirmationGet = function (req, res, next) {
//     var error;
//     // Find a matching token //// AJAX THIS STUFF AJ TODO
//     // console.log(req.query.id)
//     console.log(req.params.id)
//     const tokenFinder = new Promise(function (resolve, reject) {

//         tokenSchema.findOne({ token: req.params.id }, function (err, token) {
//             if (!token) {
//                 error = lang.errorNoUserFound;
//                 // console.log(req.params.id)

//                 // req.session.sessionFlash = {
//                 //     type: 'message',
//                 //     message: lang.errorNoUserFound
//                 // },
//                 //     res.redirect('/#modal=email-verify');
//                 // return;
//             } else { resolve(token) };
//         });
//     });
//     function userVerifier(token) {
//         return new Promise(
//             function (resolve, reject) {


//                 // If we found a token, find a matching user
//                 userSchema.findOne({ _id: token._userId }, function (err, user) {
//                     if (!user) {
//                         error = lang.errorNoUserFound
//                     } else {

//                         // req.session.sessionFlash = {
//                         //     type: 'message',
//                         //     message: lang.errorNoUserFound
//                         // },
//                         //     res.redirect('/#modal=email-verify');
//                         // return;


//                         // Verify and save the user
//                         console.log(user);
//                         user.status = 'EMAIL'
//                         user.save(function (err) {
//                             console.log(user);
//                             if (err) {
//                                 error = lang.errorDefault;
//                             } else {
//                                 data = {}

//                                 if (error) {
//                                     data.failure = req.headers.host + '/#modal=email-verify';
//                                     data.message = error;
//                                     req.session.sessionFlash = { type: "error", message: error };
//                                 }
//                                 // Delete cookie to make edits to user and to make sure they have to login again
//                                 delete req.session.user;
//                                 req.session.sessionFlash = { type: "message", message: lang.messageEmailVerified }
//                                 // res.status(200).send("The account has been verified. Please log in.");
//                                 resolve(data);
//                             }
//                         })
//                     };
//                 });
//             });
//     };

//     tokenFinder
//         .then(user => {
//             console.log('success from token route')
//             userVerifier(token);
//         }).then(data => {
//             console.log(data)
//             var data = {};
//             req.session.sessionFlash = { type: "message", message: lang.messageEmailVerified }
//             data.redirect = req.headers.host + '/user';
//             data.message = lang.messageVerifyEmailSent;
//             console.log('success from route');
//             res.send(data)
//         }).catch((err => {
//             console.log(err)
//             console.log('error from route');
//             res.send(err);
//         }))
// }