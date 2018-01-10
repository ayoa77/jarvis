var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    lang: String,
    country: String,
    commitether: String,
    passwordResetToken: { type: String, default: '123' },
    passwordResetExpires: { type: Date, default: Date.now() },
    status:{ type: String, enum: ['NEW', 'EMAIL', 'EULA']},
});

mongoose.model('user', userSchema);
