const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    mpesaReceiptNumber: {
        type: String,
        unique: true
    },
    phoneNumber: String,
    paymentStatus: {
        type: String,
        default: 'Completed'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;