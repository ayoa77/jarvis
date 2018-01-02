var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    // userId: Number,
    email: { type: String, unique: true },
    password: String,
    status:{ type: String, enum: ['NEW', 'EMAIL', 'APPROVED'], default: 'NEW'}	
   
});

mongoose.model('user', userSchema);
