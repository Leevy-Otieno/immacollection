import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadingCart = new Array(4).fill(null);
  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.viewCardProduct.url, {
        method: SummaryApi.viewCardProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const responseData = await response.json();

      if (responseData.success) {
        setData(responseData.data);
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

  // Increase quantity of cart item
  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty + 1,
        }),
      });
      const resData = await response.json();
      if (resData.success) {
        fetchData();
        if (fetchUserAddToCart) fetchUserAddToCart();
      } else {
        toast.error(resData.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Decrease quantity of cart item
  const decreaseQty = async (id, qty) => {
    if (qty > 1) {
      try {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
            quantity: qty - 1,
          }),
        });
        const resData = await response.json();
        if (resData.success) {
          fetchData();
          if (fetchUserAddToCart) fetchUserAddToCart();
        } else {
          toast.error(resData.message || "Failed to update quantity");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Delete cart item
  const deleteCartItem = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success(resData.message);
        fetchData();
        if (fetchUserAddToCart) fetchUserAddToCart();
      } else {
        toast.error(resData.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Total Quantity & Total Amount
  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0,
  );
  const totalAmount = data.reduce((previousValue, currentValue) => {
    const itemPrice =
      currentValue?.productId?.sellingPrice ||
      currentValue?.productId?.price ||
      0;
    return previousValue + itemPrice * currentValue.quantity;
  }, 0);

  // Handle M-Pesa Checkout & STK Push
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

    setIsProcessingPayment(true);

    try {
      const response = await fetch(
        SummaryApi.mpesaCheckout?.url ||
          "http://localhost:8080/api/mpesa-stk-push",
        {
          method: SummaryApi.mpesaCheckout?.method || "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            phone: phoneNumber,
            amount: totalAmount,
            cartItems: data, // Sends products along with their selectedSize and quantity
          }),
        },
      );

      const resData = await response.json();

      if (resData.success) {
        toast.success(
          resData.message ||
            "STK Push sent! Check your phone to enter your M-Pesa PIN.",
        );
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-lg font-semibold my-2">Shopping Cart</h2>

      {data.length === 0 && !loading && (
        <div className="bg-white py-8 rounded text-center text-slate-500">
          <p className="text-lg font-medium">Your Cart is Empty</p>
          <button
            onClick={() => navigate("/")}
            className="mt-3 bg-amber-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-amber-700"
          >
            Continue Shopping
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 justify-between">
        {/* Left Side: Cart Items List */}
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
                    className="w-full bg-white flex justify-between p-3 border border-slate-200 rounded my-2 gap-3 shadow-sm"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-slate-100 p-1 rounded flex items-center justify-center shrink-0">
                      <img
                        src={product?.productId?.productImage?.[0]}
                        alt={product?.productId?.productName}
                        className="w-full h-full object-scale-down mix-blend-multiply"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-800 line-clamp-1 text-base">
                            {product?.productId?.productName}
                          </h3>
                          <p className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mt-1 inline-block">
                            Size: {product?.selectedSize || "Standard"}
                          </p>
                          <p className="text-xs text-slate-400 capitalize mt-0.5">
                            {product?.productId?.category}
                          </p>
                        </div>

                        <div
                          className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                          onClick={() => deleteCartItem(product?._id)}
                          title="Remove item"
                        >
                          <MdDelete size={18} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              decreaseQty(product?._id, product?.quantity)
                            }
                            className="border border-slate-300 px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-200 font-bold text-slate-700"
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
                            className="border border-slate-300 px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-200 font-bold text-slate-700"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Price */}
                        <p className="font-bold text-amber-600 text-sm">
                          Ksh {subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Right Side: Order Summary & M-Pesa Checkout */}
        {data.length > 0 && (
          <div className="w-full max-w-sm bg-white p-5 border border-slate-200 rounded shadow-sm h-fit">
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

            {/* M-Pesa Payment Form */}
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
                placeholder="e.g. 0712345678 or 2547..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded text-sm focus:outline-none focus:border-amber-600"
                required
              />

              <button
                type="submit"
                disabled={isProcessingPayment}
                className={`w-full py-3 rounded font-semibold text-white transition-colors mt-2 ${
                  isProcessingPayment
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {isProcessingPayment
                  ? "Sending STK Push..."
                  : "Pay with M-Pesa"}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              🔒 Secure M-Pesa checkout. Inventory for your chosen size will be
              automatically reserved upon successful payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
