var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, unique: true },
    mailingList: { type: Boolean, default: false },
    password: String,
    passwordResetToken: { type: String, default: '123' },
    passwordResetExpires: { type: Date, default: Date.now() },
    status:{ type: String, enum: ['NEW', 'EMAIL', 'APPROVED']},
});

mongoose.model('user', userSchema);
