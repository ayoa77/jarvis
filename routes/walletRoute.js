//need to place wallet logic here
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var walletSchema = mongoose.model('wallet', walletSchema);
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');

// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
};

///need to add edit logic to this
router.post('/', function (req, res, next) {
    
    req.checkBody('wallet', `Please enter a properly formatted Ethereum wallet id<%= i18n.commitedEthereum-format-incorrect %>`).len(42);
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors)
        res.send(errors);
        return;
    } else {

    console.log(req.session.user);
    walletSchema.findOne({userID: req.session.user._id}, function (err, wallet) {


        wallet.wallet = req.body.wallet || wallet.wallet,

            wallet.save(function (err) {
                if (err) {
                    
                    error = 'We have experienced an unknown error. Contact us if this persists.';
                    if (err.code === 11000) {
                        error = 'Something went wrong, please try again or contact us.';
                    }
                    res.redirect('back');
                }
                console.log(wallet);
                //put flash message here
            });

        var transporter = nodemailer.createTransport(sgTransport(options));
        var mailOptions = { from: 'noreply@jarvis.ai', to: req.session.user.email, subject: 'Your Jarvis user was edited', text: `Hello ${req.session.user.name || req.session.user.email},\n\n` + 'If you did not make this request, please contact us immediately by visiting us at http://' + req.headers.host + '.\n' };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            // res.status(200).send('A verification email has been sent to ' + user.email + '.');

            res.redirect('/user');
        }
    
        )
    });
    };
});

module.exports = router;