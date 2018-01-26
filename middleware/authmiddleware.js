//express validator middleware for register route
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
// var mongoose = require('mongoose');
// var userSchema = mongoose.model('user', userSchema);


module.exports.register = function (req, res, next) {
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


    });

    req.check('email', lang.errorduplicate_email).isEmailAvailable();

    req.check('password', lang.errorpassword_format_incorrect)
        .isLength({ min: 5 })
        .matches(/\d/);

    req.asyncValidationErrors().catch(function (errors) {

        if (errors) {
            console.log(errors);
            return res.send({
                errors: errors
            });
                } else {
    
                next();
                }
    });
            next();
};