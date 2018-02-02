var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userSchema = mongoose.model('user', userSchema);

router.post('/language', function (req, res) {
    back = req.header('Referer') || '/';

    if (req.session && req.session.user){
        console.log(req.session)
        console.log(req.body.lang)

        userSchema.findOne({ email: req.session.user.email }, function (err, user) {

            userSchema.update({ _id: user._id, }, {
                $set:
                {
                    lang: req.body.lang || user.lang,
                }
            }
            ).exec(function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    // req.session.user = user;
                    console.log(user);
                    req.session.locale = req.body.lang,
                    req.session.user.lang = req.body.lang

                };
            });
        });
    } else {
        req.session.locale = req.body.lang
    }

    res.redirect(back);
});

module.exports = router;

