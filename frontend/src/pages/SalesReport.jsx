import React, { useEffect, useState } from 'react';
import DisplayCurrency from '../helpers/displayCurrency';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesReport = () => {
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    estimatedCOGS: 0,
    netProfit: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    weeklyOrdersCount: 0,
    monthlyOrdersCount: 0,
    yearlyOrdersCount: 0,
    monthlyBreakdown: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'monthly', 'yearly'

  const fetchSalesReport = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales-report`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sales report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const handleDownloadPDF = (reportType) => {
    const oldTitle = document.title;
    document.title = `The_Immaculate_Store_${reportType}_Sales_Report_${new Date().toISOString().slice(0, 10)}`;
    window.print();
    document.title = oldTitle;
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Financial Analytics...</div>;

  // Filter Data Calculations
  const todayStr = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const dailyOrders = reportData.orders.filter(o => new Date(o.date).toDateString() === todayStr);
  const dailyRevenue = dailyOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const monthlyOrders = reportData.orders.filter(o => {
    const d = new Date(o.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const yearlyOrders = reportData.orders.filter(o => new Date(o.date).getFullYear() === currentYear);
  const yearlyRevenue = yearlyOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Chart Configurations
  const dailyChartData = {
    labels: dailyOrders.map((_, index) => `Transaction #${index + 1}`),
    datasets: [{
      fill: true,
      label: 'Today Revenue Flow',
      data: dailyOrders.map(o => o.totalAmount),
      borderColor: 'rgb(13, 148, 136)',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      tension: 0.3
    }]
  };

  const monthlyChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Monthly Trend',
      data: [monthlyRevenue * 0.2, monthlyRevenue * 0.3, monthlyRevenue * 0.25, monthlyRevenue * 0.25],
      backgroundColor: 'rgba(37, 99, 235, 0.8)',
    }]
  };

  const yearlyChartData = {
    labels: reportData.monthlyBreakdown.map(item => item.monthName),
    datasets: [{
      fill: true,
      label: 'Jan - Dec Revenue Trajectory',
      data: reportData.monthlyBreakdown.map(item => item.revenue),
      borderColor: 'rgb(217, 119, 6)',
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      tension: 0.3
    }]
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* ─── PRINT-ONLY PROFESSIONAL HEADER (Appears on downloaded PDF) ─── */}
      <div className="hidden print:block mb-8 border-b border-slate-300 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">THE IMMACULATE STORE</h1>
        <p className="text-sm font-semibold text-amber-600 uppercase tracking-widest mt-1">
          {activeTab.toUpperCase()} FINANCIAL AUDIT & SALES REPORT
        </p>
        <p className="text-xs text-slate-500 mt-2">Generated on: {new Date().toLocaleString()}</p>
      </div>

      {/* Screen Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Store Performance & Audit</h2>
          <p className="text-xs text-slate-500">Inspect granular daily, monthly, and yearly performance metrics</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ☀️ Daily Report
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            📅 Monthly Report
          </button>
          <button 
            onClick={() => setActiveTab('yearly')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            📊 Yearly Report (Jan-Dec)
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1. DAILY REPORT SECTION                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'daily' || window.matchMedia('print').matches) && (
        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center print:hidden">
            <h3 className="text-lg font-bold text-slate-800">Daily Performance Overview</h3>
            <button 
              onClick={() => handleDownloadPDF('Daily')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-sm transition flex items-center gap-2"
            >
              📥 Download Daily PDF Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Today's Revenue</p>
              <h4 className="text-2xl font-bold text-teal-600 mt-2">{DisplayCurrency(dailyRevenue)}</h4>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Orders Today</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-2">{dailyOrders.length} Completed</h4>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Est. Daily Profit</p>
              <h4 className="text-2xl font-bold text-emerald-600 mt-2">{DisplayCurrency(dailyRevenue * 0.4)}</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:hidden">
            <h4 className="font-semibold text-slate-700 text-sm mb-4">📈 Today's Transaction Flow</h4>
            <div className="h-64"><Line data={dailyChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-sm text-slate-700">Today's Order Log</div>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs border-b border-slate-100">
                  <th className="p-3">Time</th>
                  <th className="p-3">Receipt</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyOrders.map(o => (
                  <tr key={o._id}>
                    <td className="p-3 text-slate-600">{new Date(o.date).toLocaleTimeString()}</td>
                    <td className="p-3 font-medium">{o.mpesaReceiptNumber || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{o.phoneNumber}</td>
                    <td className="p-3 text-slate-600">{o.products.map(p => `${p.productId?.productName} (x${p.quantity})`).join(', ')}</td>
                    <td className="p-3 font-semibold text-emerald-600">{DisplayCurrency(o.totalAmount)}</td>
                  </tr>
                ))}
                {dailyOrders.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-slate-400">No sales recorded today yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 2. MONTHLY REPORT SECTION                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'monthly' || window.matchMedia('print').matches) && (
        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center print:hidden">
            <h3 className="text-lg font-bold text-slate-800">Monthly Performance Overview</h3>
            <button 
              onClick={() => handleDownloadPDF('Monthly')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-sm transition flex items-center gap-2"
            >
              📥 Download Monthly PDF Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Monthly Revenue</p>
              <h4 className="text-2xl font-bold text-blue-600 mt-2">{DisplayCurrency(monthlyRevenue)}</h4>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Orders This Month</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-2">{monthlyOrders.length} Completed</h4>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Est. Monthly Net Profit</p>
              <h4 className="text-2xl font-bold text-emerald-600 mt-2">{DisplayCurrency(monthlyRevenue * 0.4)}</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:hidden">
            <h4 className="font-semibold text-slate-700 text-sm mb-4">📊 Weekly Revenue Distribution</h4>
            <div className="h-64"><Bar data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-sm text-slate-700">Monthly Transaction Log</div>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs border-b border-slate-100">
                  <th className="p-3">Date</th>
                  <th className="p-3">Receipt</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyOrders.map(o => (
                  <tr key={o._id}>
                    <td className="p-3 text-slate-600">{new Date(o.date).toLocaleDateString()}</td>
                    <td className="p-3 font-medium">{o.mpesaReceiptNumber || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{o.phoneNumber}</td>
                    <td className="p-3 text-slate-600">{o.products.map(p => `${p.productId?.productName} (x${p.quantity})`).join(', ')}</td>
                    <td className="p-3 font-semibold text-emerald-600">{DisplayCurrency(o.totalAmount)}</td>
                  </tr>
                ))}
                {monthlyOrders.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-slate-400">No sales recorded this month.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3. YEARLY REPORT SECTION (JAN - DEC)                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'yearly' || window.matchMedia('print').matches) && (
        <div className="space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <h3 className="text-lg font-bold text-slate-800">Yearly Performance Overview (Jan - Dec)</h3>
            <button 
              onClick={() => handleDownloadPDF('Yearly')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-sm transition flex items-center gap-2"
            >
              📥 Download Yearly PDF Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Yearly Revenue ({new Date().getFullYear()})</p>
              <h4 className="text-2xl font-bold text-indigo-600 mt-2">{DisplayCurrency(yearlyRevenue)}</h4>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Total Orders Fulfilled</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-2">{yearlyOrders.length} Completed</h4>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase">Est. Annual Net Profit</p>
              <h4 className="text-2xl font-bold text-emerald-600 mt-2">{DisplayCurrency(yearlyRevenue * 0.4)}</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:hidden">
            <h4 className="font-semibold text-slate-700 text-sm mb-4">📈 Jan - Dec Revenue Trajectory</h4>
            <div className="h-64"><Line data={yearlyChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>

          {/* Jan - Dec Breakdown Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-sm text-slate-700">
              📅 Month-by-Month Breakdown ({new Date().getFullYear()})
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs border-b border-slate-100">
                  <th className="p-3">Month</th>
                  <th className="p-3">Orders Fulfilled</th>
                  <th className="p-3">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.monthlyBreakdown.map(item => (
                  <tr key={item.monthNumber}>
                    <td className="p-3 font-medium text-slate-800">{item.monthName}</td>
                    <td className="p-3 text-slate-600">{item.ordersCount} orders</td>
                    <td className="p-3 font-semibold text-emerald-600">{DisplayCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalesReport;