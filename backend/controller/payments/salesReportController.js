const orderModel = require("../../models/orderModel");

const getSalesReportController = async (req, res) => {
  try {
    // FIXED: Use 'createdAt' instead of 'date' to match Mongoose timestamps
    const orders = await orderModel
      .find()
      .populate("products.productId")
      .sort({ createdAt: -1 });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0,
    );

    // Estimated Profit & Loss Calculation (Assuming 60% COGS / 40% Net Margin)
    const estimatedCOGS = totalRevenue * 0.6;
    const netProfit = totalRevenue - estimatedCOGS;

    const now = new Date();
    const currentYear = now.getFullYear();

    // Safely calculate start of week without mutating 'now'
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of current month
    const startOfMonth = new Date(currentYear, now.getMonth(), 1);

    let weeklyRevenue = 0;
    let monthlyRevenue = 0;
    let yearlyRevenue = 0;
    let weeklyOrdersCount = 0;
    let monthlyOrdersCount = 0;
    let yearlyOrdersCount = 0;

    const monthlyBreakdown = Array(12)
      .fill(0)
      .map((_, i) => ({
        monthNumber: i + 1,
        monthName: new Date(currentYear, i, 1).toLocaleString("default", {
          month: "short",
        }),
        revenue: 0,
        ordersCount: 0,
      }));

    orders.forEach((order) => {
      // FIXED: Fallback to order.createdAt or current date if missing
      const orderDate = new Date(order.createdAt || order.date || Date.now());
      const orderYear = orderDate.getFullYear();
      const orderAmount = order.totalAmount || 0;

      if (orderDate >= startOfWeek) {
        weeklyRevenue += orderAmount;
        weeklyOrdersCount++;
      }
      if (orderDate >= startOfMonth) {
        monthlyRevenue += orderAmount;
        monthlyOrdersCount++;
      }
      if (orderYear === currentYear) {
        yearlyRevenue += orderAmount;
        yearlyOrdersCount++;

        const monthIndex = orderDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyBreakdown[monthIndex].revenue += orderAmount;
          monthlyBreakdown[monthIndex].ordersCount += 1;
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Sales report fetched successfully",
      data: {
        totalRevenue,
        estimatedCOGS,
        netProfit,
        weeklyRevenue,
        monthlyRevenue,
        yearlyRevenue,
        weeklyOrdersCount,
        monthlyOrdersCount,
        yearlyOrdersCount,
        monthlyBreakdown,
        orders,
      },
    });
  } catch (err) {
    console.error("Sales Report Error:", err.message);
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = getSalesReportController;
