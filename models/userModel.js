var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    lang: { type: String, default: ' ' },
    // country: String,
    commitEther: { type: String, default: ' ' },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Date, default: Date.now() },
    status:{ type: String, enum: ['NEW', 'EMAIL', 'KYC', 'COMPLETE']},
    wallet: String,
    jarvis: { type: String, default: "0" },
    ethereum: { type: String, default: "0" }
});

userSchema.methods.isEmailAvailabe = function isEmailAvailable(email) {
    return new Promise(function (resolve, reject) {
        userSchema.findOne({ 'email': email }, function (err, results) {
            if (err) {
                return resolve(err);
            }
            reject(results);
        });
    });
};

mongoose.model('user', userSchema);
