var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var walletSchema = new Schema({

    wallet: String,
    jarvis: { type: String, default: "0" },
    ethereum: { type: String, default: "0" },
});

mongoose.model('wallet', walletSchema);