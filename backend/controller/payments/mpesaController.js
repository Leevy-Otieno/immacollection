const axios = require('axios');

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

// 2. Controller to trigger M-Pesa STK Push prompt
const stkPushController = async (req, res) => {
    try {
        const { phone, amount } = req.body;

        if (!phone || !amount) {
            return res.status(400).json({
                message: 'Phone number and amount are required',
                success: false,
                error: true,
            });
        }

        // Format phone number to 2547XXXXXXXX
        let formattedPhone = phone.replace(/\s+/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = `254${formattedPhone.slice(1)}`;
        } else if (formattedPhone.startsWith('+')) {
            formattedPhone = formattedPhone.slice(1);
        }

        const accessToken = await getAccessToken();
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;

        // Generate YYYYMMDDHHMMSS timestamp
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

// 3. Controller to handle transaction results returned by Safaricom
const mpesaCallbackController = async (req, res) => {
    try {
        const callbackData = req.body;
        const stkCallback = callbackData?.Body?.stkCallback;

        if (stkCallback && stkCallback.ResultCode === 0) {
            const receiptObj = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'MpesaReceiptNumber');
            console.log(`Payment Successful! M-Pesa Receipt: ${receiptObj ? receiptObj.Value : 'N/A'}`);
        } else {
            console.log(`Payment Cancelled or Failed: ${stkCallback?.ResultDesc}`);
        }

        res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
    } catch (error) {
        console.error("Callback error:", error);
        res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
    }
};

module.exports = { stkPushController, mpesaCallbackController };