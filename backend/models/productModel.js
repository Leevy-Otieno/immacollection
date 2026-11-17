const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    // Store size quantities as an object/map (e.g., { S: 5, M: 10, L: 2, XL: 0 })
    sizesStock: {
        type: Map,
        of: Number,
        default: {}
    },
    productImage: [],
    description: String,
    price: Number,        // Selling Price
    buyingPrice: Number,  // Cost / Buying Price
}, {
    timestamps: true
});

const productModel = mongoose.model('product', productSchema);
productModel.createIndexes();

module.exports = productModel;