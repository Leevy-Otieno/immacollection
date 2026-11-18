import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(SummaryApi.userOrders.url, {
        method: SummaryApi.userOrders.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-600 font-medium">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        My Orders & Live Tracking
      </h2>
      {orders.length === 0 ? (
        <p className="text-slate-500 bg-white p-6 rounded border text-center">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between border-b pb-4 mb-4 gap-2">
                <div>
                  <p className="text-xs text-slate-400">
                    ORDER ID: {order._id}
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    Status: {order.orderStatus}
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    Total: KES {order.totalAmount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {order.products?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-slate-50 p-3 rounded"
                  >
                    <img
                      src={
                        item.productId?.productImage?.[0] ||
                        "https://via.placeholder.com/60"
                      }
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-800">
                        {item.productId?.productName || "Apparel Item"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Size:{" "}
                        <span className="font-bold text-slate-700">
                          {item.selectedSize || "N/A"}
                        </span>{" "}
                        | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      KES {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Live Fulfillment Timeline
                </h4>
                <div className="border-l-2 border-slate-200 ml-2 pl-4 space-y-4">
                  {order.shippingUpdates?.map((update, uIdx) => (
                    <div key={uIdx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-orange-600 ring-4 ring-white" />
                      <p className="text-sm font-semibold text-slate-800">
                        {update.status}
                      </p>
                      <p className="text-xs text-slate-600">{update.message}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
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
