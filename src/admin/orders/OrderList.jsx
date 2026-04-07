import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, Eye, Loader2, XCircle, Search, Filter, Calendar, ChevronDown } from 'lucide-react'; // 🔥 Added ChevronDown
import { Link } from 'react-router-dom'; 
import API from '../../api/axiosInstance'; 

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); 

  // State for Filtering, Searching, and Dates
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getToken = () => localStorage.getItem('alday_auth_token') || localStorage.getItem('admin_token');

  // 1. READ: Fetch all orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const res = await API.get('/admin/orders', config).catch(() => API.get('/admin/order', config));
      
      let rawOrders = [];
      if (res.data && Array.isArray(res.data.orders)) {
          rawOrders = res.data.orders;
      } else if (res.data && Array.isArray(res.data)) {
          rawOrders = res.data;
      } else if (Array.isArray(res.data?.data)) {
          rawOrders = res.data.data;
      }
      
      // Sort newest first
      const sortedOrders = [...rawOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders); 
      setError('');
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError('Failed to load orders. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. UPDATE: Change order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      
      // Update local state instantly (Optimistic UI)
      setOrders(orders.map(order => 
        (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
      ));

      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      await API.patch(`/admin/order/${orderId}/status`, { status: newStatus }, config);
      
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert(err.response?.data?.message || "Failed to update status. Reverting to previous state.");
      fetchOrders(); 
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const getStatusBadge = (status) => {
    const base = "px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest inline-block border";
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
      case 'CANCELLED': return `${base} bg-red-50 text-red-700 border-red-200`;
      case 'SHIPPED': return `${base} bg-blue-50 text-blue-700 border-blue-200`;
      case 'PROCESSING': return `${base} bg-indigo-50 text-indigo-700 border-indigo-200`;
      case 'CONFIRMED': return `${base} bg-cyan-50 text-cyan-700 border-cyan-200`;
      case 'RETURNED': return `${base} bg-gray-100 text-gray-700 border-gray-300`;
      default: return `${base} bg-amber-50 text-amber-700 border-amber-200`; 
    }
  };

  const getNextStatusAction = (currentStatus) => {
    switch(currentStatus?.toUpperCase()) {
      case 'PENDING': return { next: 'CONFIRMED', label: 'Confirm Order', color: 'bg-black hover:bg-gray-800 text-white' };
      case 'CONFIRMED': return { next: 'PROCESSING', label: 'Start Processing', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' };
      case 'PROCESSING': return { next: 'SHIPPED', label: 'Mark Shipped', color: 'bg-blue-600 hover:bg-blue-700 text-white' };
      case 'SHIPPED': return { next: 'DELIVERED', label: 'Mark Delivered', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' };
      default: return null; 
    }
  };

  // FILTER LOGIC
  const filteredOrders = orders.filter((order) => {
    const orderStatus = (order.status || 'PENDING').toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || orderStatus === statusFilter;
    
    const searchString = searchTerm.toLowerCase();
    const orderIdStr = (order.orderNumber || String(order._id || order.id)).toLowerCase();
    const customerNameStr = (order.user?.fullName || order.user?.name || order.shippingAddress?.fullName || 'Guest User').toLowerCase();
    const matchesSearch = searchString === '' || orderIdStr.includes(searchString) || customerNameStr.includes(searchString);

    let matchesDate = true;
    if (startDate || endDate) {
      const orderDate = new Date(order.createdAt || order.date);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); 
        matchesDate = matchesDate && orderDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); 
        matchesDate = matchesDate && orderDate <= end;
      }
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track, update, and manage customer orders.</p>
      </div>
      
      {/* 🔥 UPGRADED PREMIUM FILTERS BAR: All in one line */}
      <div className="flex flex-col xl:flex-row gap-4 items-center mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 w-full">
        
        {/* Search Bar */}
        <div className="relative w-full xl:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white"
          />
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2 w-full xl:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
          <Calendar size={16} className="text-gray-400 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="text-xs sm:text-sm outline-none text-gray-600 bg-transparent w-full cursor-pointer" 
            />
            <span className="text-gray-400 text-xs font-medium">to</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="text-xs sm:text-sm outline-none text-gray-600 bg-transparent w-full cursor-pointer" 
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }} 
              className="ml-1 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Clear Dates"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>

        {/* 🔥 NEW: Status Dropdown Filter */}
        <div className="relative w-full xl:w-48 flex-shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white appearance-none cursor-pointer"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'ALL STATUSES' : status}
              </option>
            ))}
          </select>
          {/* Custom Chevron for the select dropdown */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown size={14} />
          </div>
        </div>

      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="animate-pulse font-medium">Loading orders from server...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-gray-900 mb-1">No orders found</p>
          <p className="text-sm">When customers place orders, they will appear here.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-gray-100">
          <Search size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-gray-900 mb-1">No matching orders</p>
          <p className="text-sm">Try adjusting your search, date, or filter criteria.</p>
          <button onClick={clearAllFilters} className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 underline">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Order ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Customer</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Total</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredOrders.map((order) => {
                const orderId = order._id || order.id || Math.random().toString();
                const customerName = order.user?.fullName || order.user?.name || order.shippingAddress?.fullName || 'Guest User';
                const currentStatus = order.status ? order.status.toUpperCase() : 'PENDING';
                const nextAction = getNextStatusAction(currentStatus);
                
                return (
                  <tr key={orderId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-800">
                      <Link to={`/admin/order/${orderId}`} className="hover:text-indigo-600 transition-colors">
                        #{order.orderNumber || String(orderId).slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    
                    <td className="p-4 font-medium text-gray-700">
                      {customerName}
                    </td>
                    
                    <td className="p-4 text-gray-500 text-sm">
                      {formatDate(order.createdAt || order.date)}
                    </td>
                    
                    <td className="p-4 font-bold text-slate-900">
                      ₹{(order.totalAmount || order.totalPrice || order.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-2">
                        <span className={getStatusBadge(currentStatus)}>{currentStatus}</span>
                        
                        {nextAction && (
                          <button
                            onClick={() => handleStatusChange(orderId, nextAction.next)}
                            disabled={updatingId === orderId}
                            className={`text-[9px] px-3 py-1.5 rounded-sm uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${nextAction.color} ${updatingId === orderId ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {updatingId === orderId && <Loader2 size={12} className="animate-spin" />}
                            {nextAction.label}
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link 
                          to={`/admin/order/${orderId}`} 
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-900 transition-colors bg-indigo-50 px-3 py-1.5 rounded-md"
                        >
                          <Eye size={14} /> View
                        </Link>

                        {['PENDING', 'CONFIRMED', 'PROCESSING'].includes(currentStatus) && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to completely cancel Order #${order.orderNumber || String(orderId).slice(-6).toUpperCase()}?`)) {
                                handleStatusChange(orderId, 'CANCELLED');
                              }
                            }}
                            disabled={updatingId === orderId}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-800 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;