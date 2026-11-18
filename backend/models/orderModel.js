const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        selectedSize: { type: String, default: "" },
      },
    ],
    totalAmount: { type: Number, required: true },
    phoneNumber: { type: String, required: true },

    // Payment details
    paymentDetails: {
      checkoutRequestID: { type: String },
      receiptNumber: { type: String },
      status: { type: String, default: "Pending" }, // Pending, Completed, Failed
    },
    mpesaReceiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Professional Shipping & Fulfillment Tracking
    orderStatus: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },
    shippingUpdates: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    paymentStatus: {
      type: String,
      default: "Completed",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
