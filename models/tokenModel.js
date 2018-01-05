var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = new Schema({
    _userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now(), expires: 3600 }
});

mongoose.model('token', tokenSchema);
