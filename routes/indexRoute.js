var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mailingListSchema = mongoose.model('mailingList', mailingListSchema);
// var flash = require('express-flash');
var Mailchimp = require('mailchimp-api-v3');
var validator = require('validator');
//DEV API
var mailchimp = new Mailchimp('5e0b4a1b50b66ae689fb23e520122405-us17');
//LIVE API
// var mailchimp = new Mailchimp('mail chimp api from jarvis');
var md5 = require('md5');



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  console.log(res.locals.sessionFlash)
  res.render('index', { title: 'Jarvis', sessionFlash: res.locals.sessionFlash});
});



// router.post('/mailerSignUp', function (req, res, next) {
//   email = req.body.email;
//   function ValidateEmail(mail) {
//     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
//       //get a mailchimp api key from Jarvis guys
//       mailchimp.post('/lists/(60fd62b926)/members', {
//         email_address: email,
//         status: 'subscribed'
//       })
//         .then(function (results) {
//           console.log(results);
//         })
//         .catch(function (err) {
//           console.log(err);
//         });
//       console.log(email);
//       var mailingList = new mailingListSchema({
//         email: req.body.email,
//       });
//       console.log(mailingList.email);
//       mailingList.save(function (err) {
//         if (err) {
//           if (err.code == 11000) {
//             mailingListSchema.findOne({ email: req.body.email }, function (err, data) { //redirect to index with flash saying this email has already been added to the mailing list.
//               data.save();
//             })
//           }
//         }
//       });
//     } else {
//       res.end('please enter a valid Email.');
//     }
//   }
//   ValidateEmail(email);
//   req.flash
//   res.render('index', { title: 'Jarvis', message: "You have been successfully added to our mailing list." }); //<%= __('Hello') %> 
// });

// SMARTMYCITY LIST ea61ef4514
// REFFERAL LIST 6b20c762f9





module.exports = router;
