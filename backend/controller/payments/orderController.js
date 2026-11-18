const orderModel = require("../../models/orderModel");

// 1. Fetch logged-in customer's orders & live tracking history
const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
        success: false,
        error: true,
      });
    }

    const orders = await orderModel
      .find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User orders fetched successfully",
      data: orders,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Get User Orders Error:", err.message);
    return res.status(500).json({
      message: err.message || "Failed to fetch user orders",
      success: false,
      error: true,
    });
  }
};

// 2. Fetch all store orders for the Admin Fulfillment Dashboard
const getAdminAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All store orders fetched successfully",
      data: orders,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Admin All Orders Error:", err.message);
    return res.status(500).json({
      message: err.message || "Failed to fetch all orders",
      success: false,
      error: true,
    });
  }
};

// 3. Update order fulfillment status & append to customer tracking timeline
const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status, message } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "Order ID and new status are required",
        success: false,
        error: true,
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    order.orderStatus = status;
    order.shippingUpdates.push({
      status: status,
      message: message || `Order status updated to ${status}`,
      timestamp: new Date(),
    });

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Update Order Status Error:", err.message);
    return res.status(500).json({
      message: err.message || "Failed to update order status",
      success: false,
      error: true,
    });
  }
};

module.exports = {
  getUserOrdersController,
  getAdminAllOrdersController,
  updateOrderStatusController,
};
