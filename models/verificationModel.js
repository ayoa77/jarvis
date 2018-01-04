var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var verificationSchema = new Schema({
    // userId: Number,
    userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    verification: [String]
});

mongoose.model('verification', verificationSchema);
