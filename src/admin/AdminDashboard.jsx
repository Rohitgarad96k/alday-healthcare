import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw, AlertCircle } from 'lucide-react'; // Added icons
import API from '../api/axiosInstance'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // State for the refresh button
  const [error, setError] = useState('');

  // Wrapped in useCallback so we can trigger it manually via the Refresh button
  const fetchDashboardStats = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      
      const response = await API.get('/admin/order/stats');
      
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
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Helper to format dates safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-slate-500">
        <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse text-lg font-medium">Loading live dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back. Here's what's happening with your store today.</p>
        </div>
        
        {/* NEW: Manual Refresh Button */}
        <button 
          onClick={() => fetchDashboardStats(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white border border-gray-200 text-sm font-bold text-slate-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          <RefreshCcw size={16} className={isRefreshing ? 'animate-spin text-[#C5A059]' : ''} />
          {isRefreshing ? 'Syncing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-sm flex items-center gap-3">
          <AlertCircle size={18} />
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
          <Link to="/admin/orders" className="text-sm text-[#C5A059] font-bold hover:text-black transition-colors uppercase tracking-widest">
            View All
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
                  const orderId = order._id || order.id || Math.random().toString();
                  // Adjusted to use fullName based on previous Auth updates
                  const customerName = order.user?.fullName || order.user?.name || order.shippingAddress?.fullName || 'Guest';
                  
                  return (
                    <tr key={orderId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 font-semibold text-slate-800">
                        {/* Safe slicing to prevent crash if ID is weirdly formatted */}
                        #{String(orderId).slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{customerName}</td>
                      <td className="p-4 text-gray-500 text-sm">{formatDate(order.createdAt || order.date)}</td>
                      <td className="p-4 font-bold text-slate-800">
                        ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${
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