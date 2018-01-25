//express validator middleware for register route
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var mongoose = require('mongoose');
var userSchema = mongoose.model('user', userSchema);

module.exports.register = function (req, res, next) {
    

    req.checkBody({

        'name': {
            notEmpty: true,
            errorMessage: __('error.name_blank')
        },

        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: __('error.email_format_incorrect')
            },
            errorMessage: __('error.email_blank')
        },

        'password': {
            notEmpty: true,
            errorMessage: __('error.password_blank')
        },


    });

    req.check('email', __('error.duplicate_email')).isEmailAvailable();

    check('password', __('error.password_format_incorrect'))
        .isLength({ min: 5 })
        .matches(/\d/)

    req.asyncValidationErrors().catch(function (errors) {

        if (errors) {
        console.log(errors);
         res.send(errors);
         return;
        };
        next();
    });

   


}