var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var walletSchema = new Schema({
    userID: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    wallet: { type: String, unique: true },
    jarvis: {String, default: 0},
    ethereum: {String, default: 0},
    // birthDay:Date,	
    // adminLevel:Number
});

mongoose.model('wallet', walletSchema);
