//express validator middleware for register route
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var promise = require('bluebird');
// var mongoose = require('mongoose');
// var userSchema = mongoose.model('user', userSchema);


module.exports.register = function (req, res, next) {
    // const userValidate = new Promise(function(resolve, reject) {
    promise.all([
    req.checkBody({

        'name': {
            notEmpty: true,
            errorMessage: lang.errorname_blank
        },

        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: lang.erroremail_format_incorrect
            },
            errorMessage: lang.erroremail_blank
        },

        'password': {
            notEmpty: true,
            errorMessage: lang.errorpassword_blank
        },


    }),

    req.check('email', lang.errorduplicate_email).isEmailAvailable(),

    req.check('password', lang.errorpassword_format_incorrect)
        .isLength({ min: 5 })
        .matches(/\d/),

    req.asyncValidationErrors()]).then(function (value){
        console.log('saving user -> send to user/verification page from here')
        next();
    })
    .catch(function errors(err){
    
        console.log(err);
        console.log("got here");

        res.send(err);
    })
    // 
    
    };