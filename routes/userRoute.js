var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var mongoose = require('mongoose');
var userSchema = mongoose.model('user', userSchema);
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgridv3-transport');

// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
  auth: {
    api_key: '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'
  }
};



router.get('/', csrfProtection, function (req, res, next) {

  if (!req.session.user) {
    res.redirect('/', { title: 'This comes up when there is no user in the session - LOAD THE LOGIN MODAL' }); //tell the page to drop down the modal
  } else if (typeof req.session.user != 'undefined' && req.session.user.status == 'NEW') {
    res.render('verify', { title: 'Verify', csrfToken: req.csrfToken() });
  } else {
    res.render('user', { title: 'User', user: req.session.user, csrfToken: req.csrfToken()});
  }
});

///need to add edit logic to this
router.post('/userEdit', csrfProtection, function (req, res, next) {
  userSchema.findOne({ email: req.session.user.email }, function (err, user) {

    user.name = req.body.name || user.name,
    user.language = req.body.language || user.language,
         
  user.save(function (err) {
    if (err) {
      error = 'We have experienced an unknown error. Contact us if this persists.';
      if (err.code === 11000) {
        error = 'Something went wrong, please try again or contact us.';
      }
      res.render('/', { error: error, csrfToken: req.csrfToken() });
    }
  });

      var transporter = nodemailer.createTransport(sgTransport(options));
        var mailOptions = { from: 'noreply@jarvis.ai', to: user.email, subject: 'Your Jarvis user was edited', text: `Hello ${user.name || user.email},\n\n` + 'If you did not make this request, please contact us immediately by visiting us at ' + req.headers.host + '.\n' };
        transporter.sendMail(mailOptions, function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }
          // res.status(200).send('A verification email has been sent to ' + user.email + '.');

          res.redirect('/user');
      }
    )}
  );
});

        


module.exports = router;
