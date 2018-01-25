var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    lang: { type: String, default: ' ' },
    country: String,
    commitEther: { type: String, default: ' ' },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Date, default: Date.now() },
    status:{ type: String, enum: ['NEW', 'EMAIL', 'EULA']},
    wallet: String,
    jarvis: { type: String, default: "0" },
    ethereum: { type: String, default: "0" }
});

mongoose.model('user', userSchema);
