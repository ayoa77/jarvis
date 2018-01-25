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
router.post('/',  (req, res, next)=>{
    var input = req.body
    // req.body.email = req.body.email.toLowerCase();
    // req.checkBody('email', __('error.email_format_incorrect')).isEmail();
    // // req.checkBody('country', `Country cannot be blank <%= __('error.Language')__.error.password-format-incorrect %>`).notEmpty();
    // req.checkBody('name', __('error.name_blank')).notEmpty();
    // req.checkBody('email', __('error.email_blank')).notEmpty();
    // req.checkBody('password', __('error.password_format_incorrect')).notEmpty().len(5, 20).matches(/^(?=.*\d)/); 
    // req.sanitizeBody('email').normalizeEmail({ remove_dots: false });
//checking to see if body passes validations
    // req.asyncValidationErrors().catch(err => {
    //     if (err) {
    //         console.log(err)
    //         return res.send(err);
    //     }
    // req.checkBody({

    //     'name': {
    //         notEmpty: true,
    //         errorMessage: 'Username is required'
    //     },

    //     'email': {
    //         notEmpty: true,
    //         isEmail: {
    //             errorMessage: 'Invalid Email Address'
    //         },
    //         errorMessage: 'Email is required'
    //     },

    //     'password': {
    //         notEmpty: true,
    //         errorMessage: 'Password is required'
    //     },
    // });
    // req.check('email', 'This username is already taken').isEmailAvailable();
    // check('password', __('error.password_format_incorrect'))
    //     .isLength({ min: 5 })
    //     .matches(/\d/)
    // req.asyncValidationErrors().catch(function (errors) {
    //     if (errors) {
    //         return res.send({
    //             success: false,
    //             errors: errors
    //         });
    //     };
    // });
    // next();

        var hash = bcrypt.hashSync(input.password, bcrypt.genSaltSync(10));
        var user = new userSchema({
            name: input.name,
            country: input.country,
            lang: req.session.locale || ' ',
            email: input.email,
            password: hash,
            commitEther: '0',
            status: 'NEW'
        });
        console.log('got here');
    user.save()
    .catch(err => {
        if (err) {
            console.log(err);
            error = __('error.default');
            if (err.code === 11000) {
                error = __('error.duplicate_email');
            }
            console.log(error);
            res.send(JSON.stringify(error));
            return;
            
        }
    })
    
    //create new token
    var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })
            // Save the verification token
            token.save().catch(err => {
                if (err) { return res.send({ msg: err.message }); 
            }
        })
            //sending token mailer
            // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            var transporter = nodemailer.createTransport(sgTransport(options))
            console.log('got here')
          
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.send({ msg: err.message }); }
                res.status(200).send(__('email.verification_email'));
                // req.session.sessionFlash = {
                //     type: 'success',
                //     message: __('email.verification_email')
                // }
            });
            });


module.exports = router;