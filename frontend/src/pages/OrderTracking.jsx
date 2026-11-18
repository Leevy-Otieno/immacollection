import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user-orders", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl pt-24 lg:pt-28">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        My Orders & Live Tracking
      </h2>

      {loading ? (
        <div className="text-center py-12 text-slate-500">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border text-center text-slate-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-2">
                <div>
                  <p className="text-xs text-slate-400">
                    Order ID:{" "}
                    <span className="font-mono text-slate-600">
                      {order._id}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}{" "}
                    at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="font-bold text-amber-600 text-base">
                    Ksh {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* M-Pesa Receipt Details */}
              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 mb-4 flex justify-between">
                <span>
                  M-Pesa Receipt:{" "}
                  <strong className="text-slate-800">
                    {order.paymentDetails?.receiptNumber ||
                      order.mpesaReceiptNumber ||
                      "Pending"}
                  </strong>
                </span>
                <span>
                  Phone: <strong>{order.phoneNumber}</strong>
                </span>
              </div>

              {/* Ordered Items Preview */}
              <div className="flex flex-col gap-3 mb-6">
                {order.products.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-lg border border-slate-100"
                  >
                    <img
                      src={item.productId?.productImage?.[0]}
                      alt={item.productId?.productName}
                      className="w-14 h-14 object-scale-down bg-white rounded border p-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800">
                        {item.productId?.productName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity} | Size:{" "}
                        <span className="font-bold text-amber-700">
                          {item.selectedSize || "Standard"}
                        </span>
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      Ksh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timeline / Progress Milestone Log */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Fulfillment Timeline
                </h5>
                <div className="border-l-2 border-amber-500 pl-4 space-y-3 ml-2">
                  {order.shippingUpdates?.map((update, uIdx) => (
                    <div key={uIdx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-600 ring-4 ring-amber-100" />
                      <p className="text-xs font-bold text-slate-800">
                        {update.status}
                      </p>
                      <p className="text-xs text-slate-500">{update.message}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
