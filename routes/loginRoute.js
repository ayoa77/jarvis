var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
var iplocation = require('iplocation');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var promise = require('bluebird');
var nodemailer = require('nodemailer');
langCheck = require('../middleware/langChecker.js');


router.get('/', csrfProtection, langCheck, function (req, res) {
    var lang = req.session.locale;
    if (!req.session.user) {
        res.render('login', { lang: lang, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
    } else {
        res.redirect('/user');
    }
});
router.get('/:id?', csrfProtection, langCheck, function (req, res, next) {
    var id = req.params.id;
    var x;
    if (id == 'false') { x = 'Please Log in' };
    if (!req.session.user) {
        res.render('login', { error: x, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
    } else {
        res.redirect('/user');

    }
});
router.post('/', csrfProtection, function (req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    data = {};

    const userVerifcation = new Promise(function (resolve, reject) {
    userSchema.findOne({ email: req.body.email }, function (err, user) {
        
        //make sure this email belongs to one of the application's users
        if (!user) {
            reject(lang.errorEmailPassMismatch); 
            } else {
            
                //comparing passwords
            if (bcrypt.compareSync(req.body.password, user.password)) {
                var c; //country variable
                c = req.session.loc
                // setting up cookie with user
                req.session.user = user;  //set-cookie: session = {email, passwords}
                req.session.cookie.expires = true;
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
                
                // deleting password from cookie
                delete req.session.user.password;

                // set user language to be the site used language 
                if (user.lang){req.session.locale = user.lang;}
                //this process is quite difficult to follow - will need refactored...maybe pull iplocation out to a different function
                if(!c){
                //  check users location (the promise should wait for this to be fulfilled if req.session.loc does not exist)
                    iplocation(req.ip, function (error, result) {
                        var maillist = 'aj@frankish.com.tw'; //, alex@frankish.com.tw
                        var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: "ayojamadi@gmail.com", pass: 'testingtester1234' } });
                        if (error) {
                            var mailOptions = { from: 'jarviserrors@jarvis.ai', to: maillist, subject: 'Location Mailer error', text: 'Hello,\n\n' + 'You are receiving this because the npm iplocation is erroring out. The server is not receiving a blank result, but it is erroring out' + ' \nhttp:\/\/' +  req.headers.host + '.\n' };
                            transporter.sendMail(mailOptions, function (err) {});
                            
                            data.message = 'successful login, we cannot find where you are browsing form with restricted country modal popping up'
                            data.redirect = req.headers.host + '/user?modal=restricted-country';
                            resolve(data);
                        } else if(!result){
                            var mailOptions = { from: 'jarviserrors@jarvis.ai', to: maillist, subject: 'Location Mailer No Response', text: 'Hello,\n\n' + 'You are receiving this because npm iplocation is not returning anything.' + ' \nhttp:\/\/' + req.headers.host + '.\n' };
                            transporter.sendMail(mailOptions, function (err) { });                    
                            
                            data.message = 'successful login, we cannot find where you are browsing form with restricted country modal popping up'
                            data.redirect = req.headers.host + '/user?modal=restricted-country';
                            resolve(data);
                        }else {
                            req.session.loc = result.country_name;
                            c = result.country_name;
                        // checking for restricted countries
                        } if (c != "United States" && c != "China" && c != "Republic of Korea" && !c) {
                            data.message = 'successful login'
                            data.redirect = req.headers.host + '/user';
                            resolve(data);
                        } else {
                            data.message = 'successful login, with restricted country modal popping up'
                            data.redirect = req.headers.host + '/user?modal=restricted-country';
                            resolve(data);

                        // TODO: may need to add a step that allows for the user to say 'I'm from Korea, I Don't want to see this message any longer'
                        }
                    });
                    //again checking for restricted countries because of ajax, must wrap this in else if and else
                } else if (c != "United States" && c != "China" && c != "Republic of Korea") {
                    data.message = 'successful login, with restricted country modal popping up'
                    data.redirect = req.headers.host + '/user?modal=restricted-country';
                    resolve(data);
                } else {
                    data.message = 'successful login'
                    data.redirect = req.headers.host + '/user';
                    resolve(data);
                }

            } else {
         
                //password miss match and rejection here
                reject(lang.errorEmailPassMismatch);
            }
        }
    });
});

        userVerifcation
        .then(data => {
        // console.log('success from verification route')
        // console.log(data);
        res.send(data);
    }).catch((err => {
        // console.log(err)
        // console.log('error from verification route')
        res.send(err);
    })
)});

module.exports = router;