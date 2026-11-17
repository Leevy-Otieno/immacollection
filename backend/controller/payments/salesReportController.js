const orderModel = require('../../models/orderModel');

const getSalesReportController = async (req, res) => {
    try {
        const orders = await orderModel.find().populate('products.productId').sort({ date: -1 });

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Estimated Profit & Loss Calculation (Assuming 60% COGS / 40% Net Margin)
        const estimatedCOGS = totalRevenue * 0.60;
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

        const monthlyBreakdown = Array(12).fill(0).map((_, i) => ({
            monthNumber: i + 1,
            monthName: new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' }),
            revenue: 0,
            ordersCount: 0
        }));

        orders.forEach(order => {
            const orderDate = new Date(order.date);
            const orderYear = orderDate.getFullYear();

            if (orderDate >= startOfWeek) {
                weeklyRevenue += order.totalAmount;
                weeklyOrdersCount++;
            }
            if (orderDate >= startOfMonth) {
                monthlyRevenue += order.totalAmount;
                monthlyOrdersCount++;
            }
            if (orderYear === currentYear) {
                yearlyRevenue += order.totalAmount;
                yearlyOrdersCount++;

                const monthIndex = orderDate.getMonth();
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthlyBreakdown[monthIndex].revenue += order.totalAmount;
                    monthlyBreakdown[monthIndex].ordersCount += 1;
                }
            }
        });

        res.json({
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
                orders
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getSalesReportController;