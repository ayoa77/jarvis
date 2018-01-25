const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

module.exports.register = function(req, res, next)
{
    req.checkBody({

        'name': {
            notEmpty: true,
            errorMessage: 'name is required'
        },

        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Invalid Email Address'
            },
            errorMessage: 'Email is required'
        },

        'password': {
            notEmpty: true,
            errorMessage: 'Password is required'
        },


    });

    req.check('email', 'This username is already taken').isEmailAvailable();

    check('password', __('error.password_format_incorrect'))
        .isLength({ min: 5 })
        .matches(/\d/)

    req.asyncValidationErrors().catch(function(errors) {

        if(errors) {
            return res.send({
                success:false,
                errors: errors
            });
        };
    });

    next();
}