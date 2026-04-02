import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance'; // Import our secure API client

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        // Fetch stats from your Vercel backend
        const response = await API.get('/admin/order/stats');
        
        // Assuming your backend returns an object with these metrics. 
        // We use fallbacks (|| 0) to ensure the UI doesn't break if a field is missing.
        const data = response.data.data || response.data;
        
        setStats({
          totalRevenue: data.revenue || data.totalRevenue || 0,
          activeOrders: data.activeOrders || data.processingOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalCustomers: data.totalUsers || data.totalCustomers || 0,
          recentOrders: data.recentOrders || []
        });
        
        setError('');
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError('Unable to load live dashboard statistics. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Helper to format dates for the recent orders table
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-lg font-medium text-slate-500">
          Loading live dashboard data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back. Here's what's happening with your store today.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-sm">
          {error}
        </div>
      )}
      
      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">{stats.activeOrders}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">{stats.totalProducts}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registered Customers</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">{stats.totalCustomers}</span>
        </div>
      </div>

      {/* Live Recent Orders Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No recent orders to display.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => {
                  const orderId = order._id || order.id;
                  const customerName = order.user?.name || order.shippingAddress?.fullName || 'Guest';
                  
                  return (
                    <tr key={orderId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 font-semibold text-slate-800">
                        #{orderId.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 text-gray-600">{customerName}</td>
                      <td className="p-4 text-gray-500 text-sm">{formatDate(order.createdAt || order.date)}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;