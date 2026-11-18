import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/all-orders", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const customMessage = prompt(
        `Enter status message for customer (e.g., "Your package has been dispatched via courier"):`,
        `Your order has been updated to: ${newStatus}`,
      );

      if (customMessage === null) {
        setUpdatingId(null);
        return; // Admin cancelled prompt
      }

      const res = await fetch(
        "http://localhost:8080/api/admin/update-order-status",
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            orderId,
            status: newStatus,
            message: customMessage,
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchAllOrders(); // Refresh list
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl pt-24 lg:pt-28">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Admin Fulfillment Dashboard
        </h2>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
          Total Orders: {orders.length}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">
          Loading store orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border text-center text-slate-500">
          No customer orders found yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4 gap-2">
                <div>
                  <p className="text-xs text-slate-500">
                    Customer:{" "}
                    <strong className="text-slate-800">
                      {order.userId?.name || "Guest User"}
                    </strong>{" "}
                    ({order.userId?.email})
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Order ID:{" "}
                    <span className="font-mono text-slate-600">
                      {order._id}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Phone:{" "}
                    <strong className="text-slate-700">
                      {order.phoneNumber}
                    </strong>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border">
                    Status: {order.orderStatus}
                  </span>
                  <span className="font-bold text-amber-600 text-base">
                    Ksh {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Receipt Info */}
              <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 mb-4 flex justify-between items-center">
                <span>
                  M-Pesa Receipt Code:{" "}
                  <strong className="font-mono">
                    {order.paymentDetails?.receiptNumber ||
                      order.mpesaReceiptNumber ||
                      "Pending Confirmation"}
                  </strong>
                </span>
                <span className="font-semibold">
                  Payment: {order.paymentDetails?.status || "Pending"}
                </span>
              </div>

              {/* Products Breakdown */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Purchased Items
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100"
                    >
                      <img
                        src={item.productId?.productImage?.[0]}
                        alt={item.productId?.productName}
                        className="w-12 h-12 object-scale-down bg-white rounded border p-1"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-xs text-slate-800 line-clamp-1">
                          {item.productId?.productName}
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} | Size:{" "}
                          <span className="font-bold text-amber-700">
                            {item.selectedSize || "Standard"}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        Ksh {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Fulfillment Action Toolbar */}
              <div className="border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Latest Update:{" "}
                  {order.shippingUpdates?.[order.shippingUpdates.length - 1]
                    ?.message || "Order initialized"}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    disabled={updatingId === order._id}
                    onChange={(e) =>
                      handleUpdateStatus(order._id, e.target.value)
                    }
                    defaultValue=""
                    className="bg-slate-50 border border-slate-300 rounded-lg text-xs p-2.5 font-semibold text-slate-700 focus:outline-none focus:border-amber-600 w-full sm:w-auto"
                  >
                    <option value="" disabled>
                      Change Fulfillment Status...
                    </option>
                    <option value="Processing">
                      Processing (Preparing items)
                    </option>
                    <option value="Shipped">
                      Mark as Shipped (Dispatched)
                    </option>
                    <option value="Out for Delivery">
                      Mark as Out for Delivery
                    </option>
                    <option value="Delivered">Mark as Delivered</option>
                    <option value="Cancelled">Cancel Order</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
