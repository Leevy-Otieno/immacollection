import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import { MdDelete, MdCheckCircle, MdError } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Payment Modal & Polling States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // "pending", "success", "failed", "timeout"
  const [checkoutReqId, setCheckoutReqId] = useState("");
  const [countdown, setCountdown] = useState(60);

  const loadingCart = new Array(4).fill(null);
  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const url =
        SummaryApi.viewCartProduct?.url ||
        SummaryApi.viewCardProduct?.url ||
        SummaryApi.getCartProduct?.url ||
        "http://localhost:8080/api/view-card-product";

      const method =
        SummaryApi.viewCartProduct?.method ||
        SummaryApi.viewCardProduct?.method ||
        SummaryApi.getCartProduct?.method ||
        "GET";

      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "content-type": "application/json" },
      });
      const responseData = await response.json();

      if (responseData.success) {
        setData(responseData.data || []);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id, quantity: qty + 1 }),
      });
      const resData = await response.json();
      if (resData.success) {
        fetchData();
        if (fetchUserAddToCart) fetchUserAddToCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty > 1) {
      try {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ _id: id, quantity: qty - 1 }),
        });
        const resData = await response.json();
        if (resData.success) {
          fetchData();
          if (fetchUserAddToCart) fetchUserAddToCart();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteCartItem = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success(resData.message);
        fetchData();
        if (fetchUserAddToCart) fetchUserAddToCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = data.reduce((acc, item) => {
    const price = item?.productId?.sellingPrice || item?.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const formatMpesaPhone = (phone) => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
    else if (cleaned.startsWith("+254")) cleaned = cleaned.slice(1);
    return cleaned;
  };

  // Real-time polling effect waiting for M-Pesa PIN confirmation
  useEffect(() => {
    let interval;
    let timer;

    if (paymentModalOpen && paymentStatus === "pending" && checkoutReqId) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPaymentStatus("timeout");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      interval = setInterval(async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/payment-status/${checkoutReqId}`,
            {
              credentials: "include",
            },
          );
          const result = await res.json();

          if (result.success && result.status === "Completed") {
            setPaymentStatus("success");
            clearInterval(interval);
            clearInterval(timer);
            if (fetchUserAddToCart) fetchUserAddToCart();
          } else if (result.success && result.status === "Failed") {
            setPaymentStatus("failed");
            clearInterval(interval);
            clearInterval(timer);
          }
        } catch (err) {
          console.error("Status check error:", err);
        }
      }, 3000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [paymentModalOpen, paymentStatus, checkoutReqId]);

  const handleMpesaCheckout = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("Please enter your M-Pesa phone number!");
      return;
    }
    if (data.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const formattedPhone = formatMpesaPhone(phoneNumber);
    if (formattedPhone.length !== 12 || !formattedPhone.startsWith("254")) {
      toast.error(
        "Please enter a valid Kenyan phone number (e.g., 0712345678)",
      );
      return;
    }

    setIsProcessingPayment(true);

    try {
      const response = await fetch(
        SummaryApi.mpesaCheckout?.url ||
          "http://localhost:8080/api/mpesa-stk-push",
        {
          method: SummaryApi.mpesaCheckout?.method || "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            phone: formattedPhone,
            amount: Math.round(totalAmount),
            cartItems: data,
          }),
        },
      );

      const resData = await response.json();

      if (resData.success && resData.data?.CheckoutRequestID) {
        setCheckoutReqId(resData.data.CheckoutRequestID);
        setPaymentModalOpen(true);
        setPaymentStatus("pending");
        setCountdown(60);
      } else {
        toast.error(resData.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("M-Pesa payment error:", error);
      toast.error("Failed to connect to M-Pesa payment gateway");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl pt-20 lg:pt-28">
      <h2 className="text-lg font-semibold my-2">Shopping Cart</h2>

      {data.length === 0 && !loading && (
        <div className="bg-white py-12 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
          <p className="text-lg font-medium mb-2">Your Cart is Empty</p>
          <button
            onClick={() => navigate("/product-category")}
            className="mt-2 bg-amber-600 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 justify-between">
        <div className="w-full max-w-xl">
          {loading
            ? loadingCart.map((el, index) => (
                <div
                  key={"cartLoading" + index}
                  className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                />
              ))
            : data.map((product) => {
                const itemPrice =
                  product?.productId?.sellingPrice ||
                  product?.productId?.price ||
                  0;
                const subtotal = itemPrice * product.quantity;

                return (
                  <div
                    key={product?._id}
                    className="w-full bg-white flex justify-between p-3 border border-slate-200 rounded-xl my-2 gap-3 shadow-sm"
                  >
                    <div className="w-24 h-24 bg-slate-100 p-1 rounded-lg flex items-center justify-center shrink-0">
                      <img
                        src={product?.productId?.productImage?.[0]}
                        alt={product?.productId?.productName}
                        className="w-full h-full object-scale-down mix-blend-multiply"
                      />
                    </div>
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-800 line-clamp-1 text-base">
                            {product?.productId?.productName}
                          </h3>
                          <p className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mt-1 inline-block">
                            Size: {product?.selectedSize || "Standard"}
                          </p>
                        </div>
                        <div
                          className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                          onClick={() => deleteCartItem(product?._id)}
                        >
                          <MdDelete size={18} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              decreaseQty(product?._id, product?.quantity)
                            }
                            className="border border-slate-300 px-2.5 py-0.5 rounded bg-slate-50 hover:bg-slate-200 font-bold text-slate-700"
                          >
                            -
                          </button>
                          <span className="font-semibold text-sm">
                            {product?.quantity}
                          </span>
                          <button
                            onClick={() =>
                              increaseQty(product?._id, product?.quantity)
                            }
                            className="border border-slate-300 px-2.5 py-0.5 rounded bg-slate-50 hover:bg-slate-200 font-bold text-slate-700"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-amber-600 text-sm">
                          Ksh {subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {data.length > 0 && (
          <div className="w-full max-w-sm bg-white p-5 border border-slate-200 rounded-xl shadow-sm h-fit">
            <h2 className="font-bold text-base text-slate-800 border-b pb-3 mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between text-slate-600 text-sm mb-2">
              <p>Total Items:</p>
              <p className="font-semibold">{totalQty} items</p>
            </div>
            <div className="flex justify-between text-slate-800 font-bold text-lg border-t pt-3 mb-4">
              <p>Grand Total:</p>
              <p className="text-amber-600">
                Ksh {totalAmount.toLocaleString()}
              </p>
            </div>

            <form
              onSubmit={handleMpesaCheckout}
              className="mt-4 flex flex-col gap-3"
            >
              <label
                htmlFor="phone"
                className="text-xs font-semibold text-slate-700"
              >
                M-Pesa Phone Number :
              </label>
              <input
                type="text"
                id="phone"
                placeholder="e.g. 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-600"
                required
              />
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3 rounded-lg font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors mt-2"
              >
                Pay with M-Pesa
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Professional Payment Processing & Status Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
            {paymentStatus === "pending" && (
              <div className="flex flex-col items-center py-4">
                <div className="relative mb-4">
                  <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-amber-700 text-sm">
                    {countdown}s
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Check Your Phone
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mb-4">
                  An M-Pesa STK push prompt has been sent to{" "}
                  <span className="font-semibold text-slate-700">
                    {phoneNumber}
                  </span>
                  . Enter your PIN to complete payment.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 w-full mb-4">
                  Waiting for confirmation... ({countdown}s remaining)
                </div>

                {/* Wrong Number / Cancel Option */}
                <button
                  onClick={() => {
                    setPaymentModalOpen(false);
                    setPaymentStatus("pending");
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline transition-colors"
                >
                  Not your number? Cancel and change number
                </button>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <MdCheckCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  Successfully Ordered!
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Payment confirmed! Your order has been placed and inventory
                  has been automatically reserved.
                </p>
                <button
                  onClick={() => {
                    setPaymentModalOpen(false);
                    navigate("/");
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Continue to Home
                </button>
              </div>
            )}

            {(paymentStatus === "failed" || paymentStatus === "timeout") && (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <MdError size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {paymentStatus === "timeout"
                    ? "Payment Timed Out"
                    : "Payment Failed"}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {paymentStatus === "timeout"
                    ? "We didn't receive your M-Pesa confirmation in time. Please try again."
                    : "The payment was canceled or declined."}
                </p>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors"
                >
                  Try Again / Change Number
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
