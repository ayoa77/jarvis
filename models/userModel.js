var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    lang: String,
    country: String,
    commitEther: { type: String, default: ' ' },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Date, default: Date.now() },
    status:{ type: String, enum: ['NEW', 'EMAIL', 'EULA']},
});

mongoose.model('user', userSchema);
