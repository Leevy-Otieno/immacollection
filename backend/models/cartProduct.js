const mongoose = require('mongoose');

const addToCartSchema = new mongoose.Schema({
    productId: {
        ref: 'product',
        type: String,
    },
    quantity: {
        type: Number,
        default: 1
    },
    selectedSize: {
        type: String,
        required: true
    },
    userId: String,
}, {
    timestamps: true
});

const addToCartModel = mongoose.model("addToCart", addToCartSchema);

module.exports = addToCartModel;