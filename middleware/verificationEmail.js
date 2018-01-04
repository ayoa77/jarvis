// function verificationEmail(req, res, next) {
//     if (!req.user) {
//         req.session.reset();
//         res.redirect('/login');
//     } else {
//         next();
//     }
// }
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);

var nodemailer = require("nodemailer");
var app = express();
/*
    Here we are configuring our SMTP Server details.
*/
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ayodeleamadi@gmail.com",
        pass: "Bling#7744"
    }
});
var rand, mailOptions, host, link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

function verificationEmail(req, res, next) {
    rand = Math.floor((Math.random() * 100) + 54);
    req.user.verification = rand;
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?id=" + rand;
    console.log(req.body);
    mailOptions = {

        to: req.body.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            //implement flash message - "there was a problem with the mailer please contact us or try again later" bootstrap maybe?
            next();
        } else {
            console.log("Message sent: " + response.message);
            //implement flash message - "Please check your email to confirm your account!" bootstrap maybe?
            next();
        }
    });
};


module.exports = verificationEmail;