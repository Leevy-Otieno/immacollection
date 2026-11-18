const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'product',
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            },
            // Stores the size chosen by the customer (e.g., 'M', 'L', 'EU 42') for inventory tracking
            selectedSize: { 
                type: String, 
                default: "" 
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentDetails: {
        checkoutRequestID: { type: String },
        receiptNumber: { type: String },
        status: { type: String, default: 'Pending' }
    },
    mpesaReceiptNumber: {
        type: String,
        sparse: true
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