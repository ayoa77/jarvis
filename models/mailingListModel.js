var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mailingListSchema = new Schema({
    email: { type: String, unique: true },
});

mongoose.model('mailingList', mailingListSchema);