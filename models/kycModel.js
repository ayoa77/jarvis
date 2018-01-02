var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var kycSchema = new Schema({
    // userId: Number,
    userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    images: [String]
});

mongoose.model('kyc', kycSchema);
