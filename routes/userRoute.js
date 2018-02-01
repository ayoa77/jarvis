var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userSchema = mongoose.model('user', userSchema);
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })
langCheck = require('../middleware/langChecker.js');
validationMiddleware = require('../middleware/validationMiddleware.js')


// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
  auth: {
    api_key: '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'
  }
};



router.get('/', csrfProtection, langCheck, function (req, res, next) {
  console.log(req.params.modal);
  console.log(req.session);
  console.log("********************************************")
  if (!req.session.user) {
    res.redirect('/#modal=login'); //tell the page to drop down the modal
  } else if (typeof req.session.user != 'undefined' && req.session.user.status == 'NEW') {
    res.redirect('/#modal=email-verify');
  } else {
    userSchema.findOne({ _id: req.session.user._id }, function (err, user) {
  // console.log(req.session.user)
  // console.log(wallet);
      res.render('user', { title: 'User', user: req.session.user, lang:lang, sessionFlash: res.locals.sessionFlash, modal: req.params.modal, csrfToken: req.csrfToken() });

    });
  }
});

///need to add edit logic to this
router.post('/',langCheck, validationMiddleware.userEdit,  function (req, res, next) {
  var error;
l
  const userSetter = new Promise(function (resolve, reject) {
  userSchema.findOne({ _id: req.session.user._id }, function (err, user) {

    userSchema.update({ _id: user._id,  }, { $set:
      {
        name: req.body.name || user.name ,
        lang: req.body.lang || user.lang ,
        country: req.body.country || user.country,
        commitEther: req.body.commitEther || user.commitEther
      }
    }
  ).exec(function (err, user) {
      if (err) {
        reject(lang.errorDefault);
      } else {

        // setting up cookie with user
        // req.session.user = user;  //set-cookie: session = {email, passwords}
        // req.session.cookie.expires = true;
        // req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        //Not sure why this isn't passing my user through...
        resolve(user);
      } 
      });
    });
  });
  function userEditedMailer(user) {
    return new Promise(function (resolve, reject) {
      // shouldn't get here if there is not user, but testing just to be safe.
      if (!user) {
        reject(lang.errorNoUserFound);
      } else {

        // req.session.user = user;
        console.log(req.body);
        console.log(user);
          
        var transporter = nodemailer.createTransport(sgTransport(options));
        var mailOptions = { from: 'noreply@jarvis.ai', to: req.session.user.email, subject: lang.messageUserEdited, text: lang.emailHello + ' ' + `${req.session.user.name || req.session.user.email},\n\n` + ' ' + lang.messageUserEdited + '. ' + lang.emailNoRequest + ' \nhttp:\/\/' + req.headers.host + '.\n' };
          transporter.sendMail(mailOptions, function (err) {
            if (err) { reject(lang.errorDefault) } else {

              if (!error) {
                var data = {};
                data.redirect = req.headers.host + '/user'
                data.message = lang.messageUserEdited
                resolve(data);
              } else {
                reject(error);
              }
            }
          });      
        };
    });
  };

userSetter
  .then(user => {
    console.log('success from user route')
    userEditedMailer(user);
  }).then(data => {
    var data = {};
    data.redirect = req.headers.host + '/user'
    data.message = lang.messageUserEdited
    console.log('success from route')
    res.send(data)
  }).catch(err => {
    console.log(err)
    console.log('error from route')
    res.send(err);
  });
});
  // userSchema.findOne({ email: req.session.user.email }, function (err, user) {

  //   user.name = req.body.name,
  //   user.lang = req.body.lang,
  //   user.commitEther = req.body.commitEther,

  // user.save(function (err) {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }

  //     return res.json({ token: generateToken(user), user: user });

    // if (err) {
    //   error = 'We have experienced an unknown error. Contact us if this persists.';
    //   if (err.code === 11000) {
    //     error = 'Something went wrong, please try again or contact us.';
    //   }
    //   return res.render('/', { error: error, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });      
  //   });
  // });

      // var transporter = nodemailer.createTransport(sgTransport(options));
      //   var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Your Jarvis user was edited', text: `Hello ${user.name || user.email},\n\n` + 'If you did not make this request, please contact us immediately by visiting us at ' + req.headers.host + '.\n' };
      //   transporter.sendMail(mailOptions, function (err) {
      //     if (err) { return res.status(500).send({ msg: err.message }); }
          // res.status(200).send('A verification email has been sent to ' + user.email + '.');
          // req.user = user;
          // req.session.user = user;
          // res.locals.user = user;
          // req.session.user.password = "null";
          // req.session.user.passwordResetToken = "null";
          // console.log(req.session.user)
          // console.log(user)
          //  res.redirect('/user');
//       // }
//     // )}
//   });
// });

        


module.exports = router;
