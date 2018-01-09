var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mailingListSchema = mongoose.model('mailingList', mailingListSchema);
// var flash = require('express-flash');
var Mailchimp = require('mailchimp-api-v3');
var validator = require('validator');
//DEV API
var mailchimp = new Mailchimp('5e0b4a1b50b66ae689fb23e520122405-us17');
// LIVE API
// var mailchimp = new Mailchimp('mail chimp api from jarvis');
var md5 = require('md5');



router.post('/mailerSignUp', function (req, res, next) {
    email = req.body.email;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        //get a mailchimp api key from Jarvis guys
        mailchimp.post('/lists/60fd62b926/members', {
            email_address: email,
            status: 'subscribed'
        })
            .then(function (results) {
                console.log(results);
            })
            .catch(function (err) {
                console.log(err);
                if (err.title = 'Member Exists') {
                    req.session.sessionFlash = {
                        type: 'message',
                        message: 'This email is already added to our mailing list! We will send you more information soon!'
                    };
                } 
            });

    } else {
        
        req.session.sessionFlash = {
        type: 'error',
        message: 'Please enter in a valid email.'
    };
    return res.redirect('/');
            }
    var mailingList = new mailingListSchema({
        email: email,
    });
    mailingList.save(function (err) {
        if (err) {
            if (err.code == 11000) {
                req.session.sessionFlash = {
                    type: 'message',
                    message: 'This email is already added to our mailing list! We will send you more information soon!' 
                };
                return res.redirect('/');
            } 
            } else {
                req.session.sessionFlash = {
                    type: 'message',
                    message: 'You have successfully signed up for our mailing list! We will send you more information soon!'
                };
            }
                res.redirect('/');
    });
});
// router.post('/mailerSignUp', function (req, res, next) {
//     email = req.body.email;
//     function ValidateEmail(mail) {
//         if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
//             //get a mailchimp api key from Jarvis guys
//             mailchimp.post('/lists/60fd62b926/members', {
//                 email_address: email,
//                 status: 'subscribed'
//             })
//                 .then(function (results) {
//                     console.log(results);
//                 })
//                 .catch(function (err) {
//                     console.log(err);
//                     if (err.title = 'Member Exists') {
//                         req.session.sessionFlash = {
//                             type: 'message',
//                             message: 'This email is already added to our mailing list! We will send you more information soon!'
//                         };
//                         res.redirect('/');
//                     }
//                 });
//             console.log(email);
//             var mailingList = new mailingListSchema({
//                 email: req.body.email,
//             });
//             console.log(mailingList.email);
//             mailingList.save(function (err) {
//                 if (err) {
//                     if (err.code == 11000) {
//                         req.session.sessionFlash = {
//                             type: 'message',
//                             message: 'This email is already added to our mailing list! We will send you more information soon!'
//                         };
//                     }
//                 }
//             });
//             res.redirect('/');
//         } else {
//             req.session.sessionFlash = {
//                 type: 'error',
//                 message: 'Please enter in a valid email.'
//             };
//             res.redirect('/');
//         }
//     }
//     ValidateEmail(email);
//     req.session.sessionFlash = {
//         type: 'message',
//         message: 'You have successfully signed up for our mailing list! We will send you more information soon!'
//     };
//     res.redirect('/');
// });




module.exports = router;
