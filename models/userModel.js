var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, unique: true },
    mailingList: { type: Boolean, default: false },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    status:{ type: String, enum: ['NEW', 'EMAIL', 'APPROVED'], default: 'NEW'}	
});

mongoose.model('user', userSchema);
