import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance'; 
import { RefreshCw, TrendingUp, ShoppingBag, Package, Users, ArrowRight, IndianRupee, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    customers: 0,
    recentOrders: [], // Added to hold the latest orders
  });

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // 1. FETCH ORDERS, CALCULATE REVENUE & GET RECENT
      let revenue = 0;
      let active = 0;
      let latest = [];
      try {
        const ordersRes = await API.get('/admin/order');
        const ordersArray = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : (Array.isArray(ordersRes.data?.data) ? ordersRes.data.data : []);

        // Calculate Revenue
        revenue = ordersArray.reduce((acc, order) => {
          return acc + (order.totalPrice || order.price || order.amount || 0);
        }, 0);

        // Count Active Orders
        active = ordersArray.filter(order =>
          order.status === 'Processing' || order.status === 'Confirmed' || order.status === 'Pending'
        ).length;

        // Sort orders by date (newest first) and grab the top 5
        const sortedOrders = [...ordersArray].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        latest = sortedOrders.slice(0, 5);

      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }

      // 2. FETCH USERS 
      let usersCount = 0;
      try {
        const usersRes = await API.get('/auth/users');
        const usersArray = Array.isArray(usersRes.data)
          ? usersRes.data
          : (Array.isArray(usersRes.data?.data) ? usersRes.data.data : []);
        usersCount = usersArray.length;
      } catch (error) {
        console.error("Failed to fetch users.", error);
      }

      // 3. FETCH PRODUCTS
      let productsCount = 0;
      try {
        const productsRes = await API.get('/product');
        const productsArray = Array.isArray(productsRes.data)
          ? productsRes.data
          : (Array.isArray(productsRes.data?.data) ? productsRes.data.data : []);
        productsCount = productsArray.length;
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }

      // 4. UPDATE ALL STATE
      setDashboardData({
        totalRevenue: revenue,
        activeOrders: active,
        totalProducts: productsCount,
        customers: usersCount,
        recentOrders: latest
      });

    } catch (error) {
      console.error("Dashboard master fetch error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Custom Skeleton Loader Component for the numbers
  const Skeleton = () => (
    <div className="h-10 w-24 bg-gray-200/50 rounded animate-pulse my-1"></div>
  );

  return (
    <div className="p-6 md:p-8 bg-[#F8F9FA] min-h-screen animate-fade-in">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {getGreeting()}, Admin
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Here is your store's performance overview for today.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-indigo-600' : 'text-gray-500'}`} /> 
          {isRefreshing ? 'Syncing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {/* Revenue Card (Dark Gradient Theme) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue</h3>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
               <IndianRupee size={20} className="text-emerald-400" />
            </div>
          </div>
          <div>
            {loading ? <div className="h-10 w-32 bg-white/10 rounded animate-pulse my-1"></div> : (
              <p className="text-4xl font-black mb-2 tracking-tight">
                ₹{dashboardData.totalRevenue.toLocaleString('en-IN')}
              </p>
            )}
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mt-4 bg-emerald-400/10 w-fit px-2.5 py-1 rounded-full">
              <TrendingUp size={14} />
              <span>Lifetime Earnings</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <IndianRupee size={120} />
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Orders</h3>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            {loading ? <Skeleton /> : (
              <p className="text-4xl font-black text-gray-900 mb-1">{dashboardData.activeOrders}</p>
            )}
            <p className="text-gray-500 text-sm mb-4">Processing & Delivered</p>
            
            <Link to="/admin/orders" className="flex items-center gap-1 text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors group/link w-fit">
              View Orders <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>

        {/* Total Products Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md hover:border-emerald-100 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Products</h3>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Package size={20} />
            </div>
          </div>
          <div>
            {loading ? <Skeleton /> : (
              <p className="text-4xl font-black text-gray-900 mb-1">{dashboardData.totalProducts}</p>
            )}
            <p className="text-gray-500 text-sm mb-4">Live on Storefront</p>
            
            <Link to="/admin/products" className="flex items-center gap-1 text-emerald-600 text-sm font-bold hover:text-emerald-800 transition-colors group/link w-fit">
              Manage Catalog <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>

        {/* Customers Card (Link Removed) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md hover:border-purple-100 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Customers</h3>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Users size={20} />
            </div>
          </div>
          <div>
            {loading ? <Skeleton /> : (
              <p className="text-4xl font-black text-gray-900 mb-1">{dashboardData.customers}</p>
            )}
            <p className="text-gray-500 text-sm mb-4">Registered Accounts</p>
            
            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium w-fit mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Growing Community
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
              <Clock size={18} className="text-gray-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Latest Orders</h2>
          </div>
          <Link 
            to="/admin/orders" 
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 group bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-white text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 animate-pulse">Loading recent orders...</td>
                </tr>
              ) : dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order) => {
                  
                  // Safe extraction for customer name based on common schemas
                  const customerName = order.user?.fullName || order.shippingAddress?.fullName || 'Guest User';
                  
                  // Status Badge Colors
                  const statusColors = {
                    'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-200',
                    'Processing': 'bg-blue-50 text-blue-600 border-blue-200',
                    'Pending': 'bg-yellow-50 text-yellow-600 border-yellow-200',
                    'Cancelled': 'bg-red-50 text-red-600 border-red-200',
                  };
                  const badgeStyle = statusColors[order.status] || 'bg-gray-50 text-gray-600 border-gray-200';

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        #{order._id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {customerName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${badgeStyle}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">
                        ₹{(order.totalPrice || order.price || order.amount || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ShoppingBag size={32} className="mb-3 text-gray-300" />
                      <p className="text-sm font-medium text-gray-600">No orders received yet.</p>
                      <p className="text-xs">When customers check out, their orders will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;