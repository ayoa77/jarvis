var nodemailer = require("nodemailer");
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var verificationSchema = mongoose.model('verification', verificationSchema);
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/
exports.sendVerification = (req, res, next) => {
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "test@gmail.com",
                pass: "testing#7"
            }
        });
        var rand, mailOptions, host, link;
    rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?id=" + rand;
    mailOptions = {

        to: req.body.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    console.log(req.body);
    console.log(link);
    console.log(rand);
    userSchema.findOne({ _id: req.params.id })
        .then(user => { //should I use cookies here to find the user?
            verification = new verificationSchema({
                userId: req.params.id,
                verification: rand,
            })
            verification.save(err => {
                if (err) {
                    console.log(err)
                } else {
                }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end("error");
                    } else {
                        console.log("Message sent: " + response.message);
                        res.redirect('/user');
                    }
                });

            });

        });

};

app.get('/verify', function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            console.log("email is verified");
            res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
        }
        else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else {
        res.end("<h1>Request is from unknown source</h1>");
    }
});

module.exports = router