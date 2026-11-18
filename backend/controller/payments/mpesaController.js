const axios = require("axios");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const addToCartModel = require("../../models/cartProduct");

// 1. Helper to generate Safaricom Daraja OAuth Access Token
const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64",
  );

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );
  return response.data.access_token;
};

// 2. Controller to trigger M-Pesa STK Push and save a Pending Order
const stkPushController = async (req, res) => {
  try {
    const { phone, amount, cartItems } = req.body;
    const userId = req.userId || req.body.userId || cartItems?.[0]?.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User authentication required. Please log in again.",
        success: false,
        error: true,
      });
    }

    if (!phone || !amount || !cartItems || cartItems.length === 0) {
      return res.status(400).json({
        message: "Phone number, amount, and cart items are required",
        success: false,
        error: true,
      });
    }

    let formattedPhone = phone.replace(/\s+/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = `254${formattedPhone.slice(1)}`;
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.slice(1);
    }

    const accessToken = await getAccessToken();
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64",
    );

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: "IMMA Collections",
      TransactionDesc: "Order Payment",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const formattedProducts = cartItems.map((item) => ({
      productId: item.productId?._id || item.productId || item._id,
      quantity: item.quantity || 1,
      price:
        item.price ||
        item.productId?.sellingPrice ||
        item.productId?.price ||
        0,
      selectedSize: item.selectedSize || item.size || "",
    }));

    if (response.data && response.data.CheckoutRequestID) {
      await orderModel.create({
        userId,
        products: formattedProducts,
        totalAmount: amount,
        phoneNumber: formattedPhone,
        paymentDetails: {
          checkoutRequestID: response.data.CheckoutRequestID,
          status: "Pending",
        },
        orderStatus: "Processing",
        shippingUpdates: [
          {
            status: "Processing",
            message:
              "Order received and payment confirmed. Preparing your items.",
            timestamp: new Date(),
          },
        ],
      });
    }

    res.status(200).json({
      message:
        "STK Push sent successfully! Check your phone to enter your M-Pesa PIN.",
      data: response.data,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("M-Pesa STK Push Error:", err?.response?.data || err.message);
    res.status(500).json({
      message:
        err?.response?.data?.errorMessage ||
        err.message ||
        "M-Pesa request failed",
      success: false,
      error: true,
    });
  }
};

// 3. Callback Controller: Updates Order Status & Automatically Deducts Size Stock
const mpesaCallbackController = async (req, res) => {
  try {
    const callbackData = req.body;
    const stkCallback = callbackData?.Body?.stkCallback;

    if (stkCallback) {
      const checkoutRequestID = stkCallback.CheckoutRequestID;

      if (stkCallback.ResultCode === 0) {
        const receiptObj = stkCallback.CallbackMetadata?.Item?.find(
          (i) => i.Name === "MpesaReceiptNumber",
        );
        const mpesaReceiptNumber = receiptObj ? receiptObj.Value : "N/A";

        const order = await orderModel.findOne({
          "paymentDetails.checkoutRequestID": checkoutRequestID,
        });

        if (order && order.paymentDetails.status === "Pending") {
          order.paymentDetails.status = "Completed";
          order.paymentDetails.receiptNumber = mpesaReceiptNumber;
          order.mpesaReceiptNumber = mpesaReceiptNumber;
          order.paymentStatus = "Completed";
          await order.save();

          for (let item of order.products) {
            const productId = item.productId;
            const orderedQty = item.quantity || 1;
            const selectedSize = item.selectedSize;

            if (selectedSize && productId) {
              const product = await productModel.findById(productId);
              if (product && product.sizesStock) {
                const currentStock = product.sizesStock.get(selectedSize) || 0;
                const newStock = Math.max(0, currentStock - orderedQty);

                product.sizesStock.set(selectedSize, newStock);
                await product.save();
              }
            }
          }

          if (order.userId) {
            await addToCartModel.deleteMany({ userId: order.userId });
          }

          console.log(
            `Order completed & size stock deducted for receipt: ${mpesaReceiptNumber}`,
          );
        }
      } else {
        await orderModel.findOneAndUpdate(
          { "paymentDetails.checkoutRequestID": checkoutRequestID },
          { "paymentDetails.status": "Failed", paymentStatus: "Failed" },
        );
        console.log(`Payment Failed: ${stkCallback.ResultDesc}`);
      }
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
  }
};

// 4. Check Payment Status Controller (For Frontend Polling)
const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestID } = req.params;
    const order = await orderModel.findOne({
      "paymentDetails.checkoutRequestID": checkoutRequestID,
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      status: order.paymentDetails.status,
      receiptNumber: order.paymentDetails.receiptNumber || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Get Logged-in Customer's Orders & Live Tracking
const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel
      .find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Admin: Get All Store Orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Admin: Update Order Shipping & Fulfillment Status
const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status, message } = req.body; // status: 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;
    order.shippingUpdates.push({
      status: status,
      message: message || `Your order status has been updated to: ${status}`,
      timestamp: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status successfully updated to ${status}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  stkPushController,
  mpesaCallbackController,
  checkPaymentStatus,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
};
