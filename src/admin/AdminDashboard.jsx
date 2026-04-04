import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  RefreshCw, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you use react-router

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // We use Promise.allSettled so if one endpoint fails, it doesn't crash the whole dashboard
      const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
        API.get('/product'),
        API.get('/order'), // Update this if your endpoint is different (e.g. '/orders')
        API.get('/user')   // Update this if your endpoint is different
      ]);

      let totalProducts = 0;
      if (productsRes.status === 'fulfilled' && productsRes.value.data) {
        // Handle both pagination format {total: X} or array format
        totalProducts = productsRes.value.data.total || productsRes.value.data.data?.length || 0;
      }

      let totalOrders = 0;
      let calculatedRevenue = 0;
      let latestOrders = [];

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data) {
        const ordersData = ordersRes.value.data.data || ordersRes.value.data || [];
        totalOrders = ordersData.length || 0;
        
        // Safely calculate revenue (assuming orders have a 'totalPrice' or 'total' field)
        calculatedRevenue = ordersData.reduce((acc, order) => {
          const orderTotal = Number(order.totalPrice || order.total || 0);
          return acc + (isNaN(orderTotal) ? 0 : orderTotal);
        }, 0);

        // Get 5 most recent orders
        latestOrders = ordersData.slice(0, 5);
      }

      let totalUsers = 0;
      if (usersRes.status === 'fulfilled' && usersRes.value.data) {
        totalUsers = usersRes.value.data.total || usersRes.value.data.data?.length || 0;
      }

      setStats({
        revenue: calculatedRevenue,
        products: totalProducts,
        orders: totalOrders,
        customers: totalUsers
      });
      setRecentOrders(latestOrders);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency beautifully
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here is what's happening with your store today.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all font-semibold text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Grid - Premium Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition-transform duration-500">
            <IndianRupee size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2">Total Revenue</p>
            <h3 className="text-3xl font-bold">{formatCurrency(stats.revenue)}</h3>
            <div className="mt-4 flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <TrendingUp size={16} />
              <span>Lifetime Earnings</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Active Orders</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.orders}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 font-medium">Processing & Delivered</p>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Products</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.products}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Package size={24} />
            </div>
          </div>
          <Link to="/admin/products" className="text-sm text-emerald-600 mt-4 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Manage Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Customers</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.customers}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 font-medium">Registered Accounts</p>
        </div>
      </div>

      {/* Bottom Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table (Takes up 2/3 of the screen) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-gray-300" />
                      Loading orders...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShoppingBag size={24} className="text-gray-300" />
                      </div>
                      <p className="font-medium text-gray-900 mb-1">No recent orders yet</p>
                      <p className="text-sm">When customers place orders, they will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-semibold text-gray-900">#{order._id?.substring(0, 8) || 'N/A'}</td>
                      <td className="p-4 text-sm text-gray-600">{order.user?.name || 'Guest User'}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-bold text-gray-900">₹{order.totalPrice || order.total || 0}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold bg-yellow-100 text-yellow-800">
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Store Insights / Quick Actions Sidebar (Takes up 1/3) */}
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-indigo-400" /> Store Insights
            </h2>
            
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-1">Top Selling Category</p>
                <p className="font-bold text-lg text-emerald-400">Haircare</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-1">Avg. Order Value</p>
                <p className="font-bold text-lg text-white">
                  {stats.orders > 0 ? formatCurrency(stats.revenue / stats.orders) : '₹0'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link 
              to="/admin/products" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/50"
            >
              + Add New Formulation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;