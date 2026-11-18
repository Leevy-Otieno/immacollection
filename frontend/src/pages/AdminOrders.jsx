import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(SummaryApi.adminAllOrders.url, {
        method: SummaryApi.adminAllOrders.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load store orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(SummaryApi.adminUpdateOrderStatus.url, {
        method: SummaryApi.adminUpdateOrderStatus.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          status: newStatus,
          message: `Your order status has been updated to: ${newStatus}`,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Order status updated successfully!");
        fetchAllOrders();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error updating order status");
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - IMMA Collections #${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .details { margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
            th { background-color: #f4f4f4; }
            .total { text-align: right; font-size: 15px; font-weight: bold; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>IMMA Collections - Official Receipt</h2>
            <p>Order ID: ${order._id}</p>
          </div>
          <div class="details">
            <p><strong>Customer:</strong> ${order.userId?.name || "Customer"} (${order.userId?.email || "N/A"})</p>
            <p><strong>Phone:</strong> ${order.phoneNumber}</p>
            <p><strong>Payment Status:</strong> ${order.paymentDetails?.status || "Completed"} (Receipt: ${order.paymentDetails?.receiptNumber || "N/A"})</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price (KES)</th>
              </tr>
            </thead>
            <tbody>
              ${order.products
                .map(
                  (p) => `
                <tr>
                  <td>${p.productId?.productName || "Apparel Item"}</td>
                  <td>${p.selectedSize || "N/A"}</td>
                  <td>${p.quantity}</td>
                  <td>${p.price * p.quantity}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">
            Total Amount: KES ${order.totalAmount?.toLocaleString()}
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600 font-semibold">
        Loading store orders...
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Admin Fulfillment Dashboard
        </h2>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
          Total Orders: {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="text-slate-500 bg-white p-6 rounded shadow-sm text-center">
          No orders have been placed yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <div className="flex flex-col md:flex-row justify-between border-b pb-4 mb-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    ORDER ID: {order._id}
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    Customer:{" "}
                    <span className="text-slate-900">
                      {order.userId?.name || "Guest"}
                    </span>{" "}
                    ({order.phoneNumber})
                  </p>
                  <p className="text-xs text-slate-500">
                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePrintInvoice(order)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                  >
                    🖨️ Print Invoice
                  </button>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold">
                      Fulfillment Status
                    </p>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="mt-1 border border-slate-300 rounded px-2 py-1 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {order.products?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-50 p-3 rounded border border-slate-100"
                  >
                    <img
                      src={
                        item.productId?.productImage?.[0] ||
                        "https://via.placeholder.com/50"
                      }
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-slate-800 truncate">
                        {item.productId?.productName || "Apparel Item"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Size:{" "}
                        <strong className="text-slate-700">
                          {item.selectedSize || "N/A"}
                        </strong>{" "}
                        | Qty: {item.quantity}
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        KES {item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold border-t pt-3 text-slate-800">
                <span>
                  Payment:{" "}
                  <span className="text-green-600">
                    {order.paymentDetails?.status || "Completed"}
                  </span>{" "}
                  ({order.paymentDetails?.receiptNumber || "N/A"})
                </span>
                <span className="text-base text-orange-600">
                  Total: KES {order.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
