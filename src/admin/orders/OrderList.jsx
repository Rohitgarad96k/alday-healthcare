import React, { useState, useEffect } from 'react';
import API from '../../api/axiosInstance'; 
import { Package, AlertCircle, Eye, Loader2 } from 'lucide-react'; // Added icons for polish

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); 

  // 1. READ: Fetch all orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/admin/order');
      
      const fetchedOrders = response.data.data || response.data || [];
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []); 
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

      // Fire off the API call
      await API.patch(`/admin/order/${orderId}/status`, { status: newStatus });
      
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert(err.response?.data?.message || "Failed to update status. Reverting to previous state.");
      // Rollback on failure
      fetchOrders(); 
    } finally {
      setUpdatingId(null);
    }
  };

  // Safe Date Formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track, update, and manage customer orders.</p>
      </div>
      
      {/* Global Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="animate-pulse font-medium">Loading orders from server...</div>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-gray-900 mb-1">No orders found</p>
          <p className="text-sm">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        /* Data Table */
        <div className="overflow-x-auto rounded-xl border border-gray-100">
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
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const orderId = order._id || order.id || Math.random().toString();
                // Standardized name parsing to match AuthContext
                const customerName = order.user?.fullName || order.user?.name || order.shippingAddress?.fullName || 'Guest User';
                
                return (
                  <tr key={orderId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-800">
                      #{String(orderId).slice(-6).toUpperCase()}
                    </td>
                    
                    <td className="p-4 font-medium text-gray-700">
                      {customerName}
                    </td>
                    
                    <td className="p-4 text-gray-500 text-sm">
                      {formatDate(order.createdAt || order.date)}
                    </td>
                    
                    <td className="p-4 font-bold text-slate-900">
                      ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    
                    <td className="p-4">
                      <div className="relative inline-flex items-center">
                        <select
                          value={order.status || 'PENDING'}
                          onChange={(e) => handleStatusChange(orderId, e.target.value)}
                          disabled={updatingId === orderId}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-sm text-[10px] uppercase tracking-widest font-bold border outline-none transition-all cursor-pointer ${
                            order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500' : 
                            order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500' : 
                            order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500' :
                            'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500'
                          } ${updatingId === orderId ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        {/* Show a mini spinner next to the select if this exact row is updating */}
                        {updatingId === orderId && (
                           <Loader2 className="absolute right-2 w-3 h-3 animate-spin text-gray-500" />
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-900 transition-colors">
                        <Eye size={14} /> View
                      </button>
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