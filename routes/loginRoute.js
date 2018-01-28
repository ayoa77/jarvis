var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = mongoose.model('user', userSchema);
var bcrypt = require('bcryptjs');
var iplocation = require('iplocation');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var promise = require('bluebird');
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
        if (!user) { reject(lang.errorNoEmailFound); 
            } else {
            
                //comparing passwords
            if (bcrypt.compareSync(req.body.password, user.password)) {
           
                // setting up cookie with user
                req.session.user = user;  //set-cookie: session = {email, passwords}
                req.session.cookie.expires = true;
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
                
                // deleting password from cookie
                delete req.session.user.password;

                // set user language to be the site used language 
                if (user.lang){req.session.locale = user.lang;}
             
                //  check users location (the promise should wait for this to be fulfilled)
                iplocation(req.ip, function (error, result) {
                    c = result.country_name;
                
                    // TODO: may need to add a step that allows for the user to say 'I'm from Korea, I Don't want to see this message any longer'
                    if(c != "United States" && c!= "China" && c!= "Republic of Korea") {
                        data.message = 'successful login'
                        data.redirect = req.headers.host  + '/user';
                        resolve(data);
                    } else {
                        data.message = 'successful login, with restricted country modal popping up'
                        data.redirect = req.headers.host + '/user?modal=restricted-country';
                        resolve(data);
                    }
                });
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