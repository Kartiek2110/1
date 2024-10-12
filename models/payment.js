const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    paymentId:{
        type: String,
        required: true
    },
    signature:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed']
    }

},{timestamps: true});

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;