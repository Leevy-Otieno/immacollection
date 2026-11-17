const axios = require('axios');
const orderModel = require('../../models/orderModel');
const productModel = require('../../models/productModel');

// 1. Helper to generate Safaricom Daraja OAuth Access Token
const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        }
    );
    return response.data.access_token;
};

// 2. Controller to trigger M-Pesa STK Push and save a Pending Order
const stkPushController = async (req, res) => {
    try {
        const { phone, amount, userId, cartItems } = req.body;

        if (!phone || !amount || !cartItems || cartItems.length === 0) {
            return res.status(400).json({
                message: 'Phone number, amount, and cart items are required',
                success: false,
                error: true,
            });
        }

        let formattedPhone = phone.replace(/\s+/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = `254${formattedPhone.slice(1)}`;
        } else if (formattedPhone.startsWith('+')) {
            formattedPhone = formattedPhone.slice(1);
        }

        const accessToken = await getAccessToken();
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;

        const date = new Date();
        const timestamp =
            date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        const stkPayload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: formattedPhone,
            PartyB: shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: 'IMMA Collections',
            TransactionDesc: 'Order Payment',
        };

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            stkPayload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Save a pending order linked to Safaricom's CheckoutRequestID
        if (response.data && response.data.CheckoutRequestID) {
            await orderModel.create({
                userId,
                products: cartItems,
                totalAmount: amount,
                paymentDetails: {
                    checkoutRequestID: response.data.CheckoutRequestID,
                    status: "Pending"
                }
            });
        }

        res.status(200).json({
            message: 'STK Push sent successfully! Check your phone to enter your M-Pesa PIN.',
            data: response.data,
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(500).json({
            message: err?.response?.data?.errorMessage || err.message || 'M-Pesa request failed',
            success: false,
            error: true,
        });
    }
};

// 3. Callback Controller: Updates Order Status & Automatically Decrements Size Stock
const mpesaCallbackController = async (req, res) => {
    try {
        const callbackData = req.body;
        const stkCallback = callbackData?.Body?.stkCallback;

        if (stkCallback) {
            const checkoutRequestID = stkCallback.CheckoutRequestID;

            if (stkCallback.ResultCode === 0) {
                // Payment was successful
                const receiptObj = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'MpesaReceiptNumber');
                const mpesaReceiptNumber = receiptObj ? receiptObj.Value : 'N/A';

                // Find the pending order
                const order = await orderModel.findOne({ "paymentDetails.checkoutRequestID": checkoutRequestID });

                if (order && order.paymentDetails.status === "Pending") {
                    order.paymentDetails.status = "Completed";
                    order.paymentDetails.receiptNumber = mpesaReceiptNumber;
                    await order.save();

                    // Automatically decrement stock for each ordered size item
                    for (let item of order.products) {
                        const productId = item.productId;
                        const orderedQty = item.quantity;
                        const selectedSize = item.size; // e.g., 'M', 'L', 'XL'

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
                    console.log(`Order completed & stock updated for receipt: ${mpesaReceiptNumber}`);
                }
            } else {
                // Payment failed or was cancelled by user
                await orderModel.findOneAndUpdate(
                    { "paymentDetails.checkoutRequestID": checkoutRequestID },
                    { "paymentDetails.status": "Failed" }
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

module.exports = { stkPushController, mpesaCallbackController };