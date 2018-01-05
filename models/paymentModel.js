var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paymentSchema = new Schema({
    // paymentId: Number,
    // userID: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    walletId: [{ type: Schema.Types.ObjectId, ref: 'wallet' }],
    transactionType: { type: String, enum: ['BUY', 'SELL']},
    token: { type: String, enum: ['ETHER', 'JAR'] },
    //may need to use mongoose-bigdecimal here
    amount: { type: Schema.Types.Decimal },
    time: { type: Date, default: Date.now() }

});

mongoose.model('payment', paymentSchema);