import mongoose from "mongoose";

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
        selectedSize: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    paymentDetails: {
      checkoutRequestID: { type: String },
      receiptNumber: { type: String },
      status: { type: String, default: "Pending" },
    },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
    },
    shippingUpdates: [
      {
        status: { type: String },
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
