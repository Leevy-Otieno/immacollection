const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    
    // Unique Shoe Number, SKU, or Product Code
    productCode: { type: String, default: "" },

    // Flexible Map to store quantities for ANY size type 
    // (e.g., Clothing: { S: 5, M: 10 } OR Shoes: { "EU 39": 4, "EU 42": 8 })
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