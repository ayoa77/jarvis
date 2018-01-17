var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userSchema = mongoose.model('user', userSchema);
var walletSchema = mongoose.model('wallet', walletSchema);
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');

// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
  auth: {
    api_key: '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'
  }
};



router.get('/', function (req, res, next) {

  if (!req.session.user) {
    res.redirect('/login'); //tell the page to drop down the modal
  } else if (typeof req.session.user != 'undefined' && req.session.user.status == 'NEW') {
    res.render('verify', { title: 'Verify', sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
  } else {
    userSchema.findOne({ _id: req.session.user._id }, function (err, user) {

    walletSchema.findOne({ userID: req.session.user._id }, function (err, wallet) {
  // console.log(req.session.user)
  // console.log(wallet);
      res.render('user', { title: 'User', user: user, wallet: wallet, sessionFlash: res.locals.sessionFlash, csrfToken: req.csrfToken() });
    });
    });
  }
});

///need to add edit logic to this
router.post('/', function (req, res, next) {
  req.checkBody('commitEther', `only numbers and decimals allowed <%= i18n.commitedEthereum-format-incorrect %>`).matches(/([0-9]+\.[0-9]*)|([0-9]*\.[0-9]+)|([0-9]+)/);
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors)
    res.send(errors);
    return;
  } else {

  userSchema.findOne({ _id: req.session.user._id }, function (err, user) {


  userSchema.update({ _id: user._id,  }, { $set:
      {
        name: req.body.name || user.name ,
        lang: req.body.lang || user.lang ,
        commitEther: req.body.commitEther || user.commitEther
      }
    }
  ).exec(function (err, user) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        // req.session.user = user;
        console.log(req.body);
        console.log(user);
          
        var transporter = nodemailer.createTransport(sgTransport(options));
          var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Your Jarvis user was edited', text: `Hello ${user.name || user.email},\n\n` + 'If you did not make this request, please contact us immediately by visiting us at ' + req.headers.host + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
              if (err) { return res.status(500).send({ msg: err.message }); }
          res.status(200).send('A verification email has been sent to ' + user.email + '.');

        res.redirect('/user');
            
        })
      };
    });
  });
};
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
