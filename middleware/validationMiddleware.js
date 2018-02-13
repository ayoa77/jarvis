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

    req.check('email', lang.errorDuplicateEmail).isEmailAvailable(),

    req.check('password', lang.errorpassword_format_incorrect)
        .isLength({ min: 6 })
        .matches(/\d/),

    req.asyncValidationErrors(true)]).then(function (value){
        next();
    })
    .catch(function errors(err){
    
        console.log(err);

        res.send(err);
    })
    // 
    
    };


module.exports.password = function (req, res, next) {
console.log('got it')
    promise.all([
        req.checkBody({

            'password': {
                notEmpty: true,
                errorMessage: lang.errorpassword_blank
            },

            'password2': {
                notEmpty: true,
                errorMessage: lang.errorpassword_blank
            },
        }),

        req.check('password', lang.errorpassword_format_incorrect)
            .isLength({ min: 6 })
            .matches(/\d/),

            // req.checkBody('confirm_password', `Passwords do not match.<%= req.i18n.__('passwords-dont-match') %>`).equals(req.body.password);
        req.check('password2', lang.errorPasswordsMatch).equals(req.body.password),

    req.asyncValidationErrors(true)]).then(function (value) {
            console.log('succeeded in authmiddleware');
            next();
        })
        .catch(function errors(err) {

            console.log(err);
            console.log("failed in authmiddleware");

            res.send(err);
        })
    // 

};

module.exports.userEdit = function (req, res, next) {
    console.log('got it')
    promise.all([
        req.checkBody('wallet', lang.errorWalletFormatIncorrect).optional({ checkFalsy: true }).len(42),

        req.checkBody('commitEther', lang.errorCommitedEthereumFormatIncorrect).optional({ checkFalsy: true }).matches(/^[1-9][\.\d]*(,\d+)?$/),


        req.asyncValidationErrors(true)]).then(function (value) {
            console.log('succeeded in authmiddleware');
            next();
        })
        .catch(function errors(err) {

            console.log(err);
            console.log("failed in authmiddleware");

            res.send(err);
        });
    // 

};
