import React, { useState, useEffect } from 'react';
import API from '../../api/axiosInstance'; // Import our secure API client

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // Tracks which order is currently saving

  // 1. READ: Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/admin/order');
      // Set the orders array (adjust .data.data if your API nests the array differently)
      setOrders(response.data.data || response.data || []); 
      setError('');
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError('Failed to load orders. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run the fetch on initial component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. UPDATE: Change the status of an order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      // The endpoint from your PDF: PATCH /api/admin/order/{id}/status
      await API.patch(`/admin/order/${orderId}/status`, { status: newStatus });
      
      // Update the local state so the UI reflects the change instantly
      setOrders(orders.map(order => 
        (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert(err.response?.data?.message || "Failed to update status. Please try again.");
      // If it fails, we fetch the original list to reset the dropdown to the truth
      fetchOrders(); 
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper function to format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>
      
      {/* Loading & Error States */}
      {isLoading ? (
        <div className="py-10 text-center text-gray-500 font-medium animate-pulse">
          Loading orders from server...
        </div>
      ) : error ? (
        <div className="py-4 px-4 bg-red-50 text-red-600 rounded-lg text-center font-medium">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No orders found yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Order ID</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Total</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const orderId = order._id || order.id;
                // Safely grab customer name depending on how your backend populates the user
                const customerName = order.user?.name || order.shippingAddress?.fullName || 'Guest User';
                
                return (
                  <tr key={orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">
                      {/* Show last 6 characters of ID for cleaner UI */}
                      #{orderId.toString().slice(-6).toUpperCase()}
                    </td>
                    <td className="p-4 text-gray-600">{customerName}</td>
                    <td className="p-4 text-gray-500">{formatDate(order.createdAt || order.date)}</td>
                    <td className="p-4 font-medium text-gray-800">₹{(order.totalAmount || order.total || 0).toFixed(2)}</td>
                    <td className="p-4">
                      {/* Interactive Status Dropdown */}
                      <select
                        value={order.status || 'PENDING'}
                        onChange={(e) => handleStatusChange(orderId, e.target.value)}
                        disabled={updatingId === orderId}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border outline-none transition-all cursor-pointer ${
                          order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' : 
                          order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        } ${updatingId === orderId ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      {/* You can build an OrderDetails modal later and connect it here */}
                      <button className="text-slate-900 hover:text-indigo-600 font-medium text-sm transition-colors">
                        View Details
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