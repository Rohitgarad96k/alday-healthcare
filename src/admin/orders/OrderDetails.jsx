import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, User, Loader2, XCircle } from 'lucide-react';
import API from '../../api/axiosInstance'; 
//  1. Import the global context
import { useOrders } from '../../context/OrderContext';

const OrderDetails = () => {
  const { id } = useParams(); 
  
  //  2. Instantly grab orders and loading state from memory
  const { orders, isLoading, fetchOrders } = useOrders();
  
  //  3. Find the specific order instantly
  const order = orders.find(o => (o._id || o.id) === id);

  const [updating, setUpdating] = useState(false);

  const getToken = () => localStorage.getItem('alday_auth_token') || localStorage.getItem('admin_token');

  // UPDATE: Change order status and forcefully re-sync GLOBAL database
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      await API.patch(`/admin/order/${id}/status`, { status: newStatus }, config);
      
      //  Tell global context to update so the OrderList is fresh when we go back!
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert(err.response?.data?.message || "Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Payment Status Changes
  const handlePaymentStatusChange = async (e) => {
    const newPaymentStatus = e.target.value;
    if (!newPaymentStatus) return;

    try {
      setUpdating(true);
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      await API.patch(`/admin/order/${id}/payment-status`, { status: newPaymentStatus }, config);
      
      await fetchOrders(); //  Sync global DB
    } catch (err) {
      console.error("Failed to update payment status:", err);
      alert(err.response?.data?.message || "Failed to update payment status.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest inline-block border";
    switch(status) {
      case 'DELIVERED': return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
      case 'CANCELLED': return `${base} bg-red-50 text-red-700 border-red-200`;
      case 'SHIPPED': return `${base} bg-blue-50 text-blue-700 border-blue-200`;
      case 'PROCESSING': return `${base} bg-indigo-50 text-indigo-700 border-indigo-200`;
      case 'CONFIRMED': return `${base} bg-cyan-50 text-cyan-700 border-cyan-200`;
      case 'RETURNED': return `${base} bg-gray-100 text-gray-700 border-gray-300`;
      default: return `${base} bg-amber-50 text-amber-700 border-amber-200`; // PENDING
    }
  };

  const getNextStatusAction = (currentStatus) => {
    switch(currentStatus) {
      case 'PENDING': return { next: 'CONFIRMED', label: 'Confirm Order', color: 'bg-black hover:bg-gray-800 text-white' };
      case 'CONFIRMED': return { next: 'PROCESSING', label: 'Start Processing', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' };
      case 'PROCESSING': return { next: 'SHIPPED', label: 'Mark Shipped', color: 'bg-blue-600 hover:bg-blue-700 text-white' };
      case 'SHIPPED': return { next: 'DELIVERED', label: 'Mark Delivered', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' };
      default: return null; 
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-500">
        <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse font-medium">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-red-500 font-bold mb-4">Order not found.</p>
        <Link to="/admin/orders" className="text-indigo-600 font-bold uppercase tracking-widest text-xs hover:underline">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const customerName = order.user?.fullName || order.user?.name || order.shippingAddress?.fullName || 'Guest User';
  const currentStatus = order.status || 'PENDING';
  const nextAction = getNextStatusAction(currentStatus);

  const taxableAmount = (order.subtotal || 0) - (order.discountAmount || 0);
  const taxPercentage = taxableAmount > 0 ? Math.round(((order.taxAmount || 0) / taxableAmount) * 100) : 0;

  return (
    <div className="bg-[#FBFBFB] min-h-screen pb-20 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
        
        <Link to="/admin/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to All Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber || String(order._id).slice(-6).toUpperCase()}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt || order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <span className={getStatusBadge(currentStatus)}>{currentStatus}</span>
            
            <div className="flex flex-wrap items-center justify-end gap-3">
              {['PENDING', 'CONFIRMED', 'PROCESSING'].includes(currentStatus) && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to completely cancel Order #${order.orderNumber || String(order._id).slice(-6).toUpperCase()}?`)) {
                      handleStatusChange('CANCELLED');
                    }
                  }}
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 px-3 py-2 border border-red-100 bg-red-50 rounded-sm"
                >
                  <XCircle size={14} /> Cancel Order
                </button>
              )}

              {nextAction && (
                <button
                  onClick={() => handleStatusChange(nextAction.next)}
                  disabled={updating}
                  className={`text-[10px] px-5 py-2.5 rounded-sm uppercase tracking-widest font-bold transition-all flex items-center gap-2 shadow-sm ${nextAction.color} ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updating && <Loader2 size={14} className="animate-spin" />}
                  {nextAction.label}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Customer Info */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><User size={14} /> Customer</h3>
            <p className="font-bold text-gray-900 text-sm mb-1">{customerName}</p>
            <p className="text-gray-600 text-sm mb-1">{order.user?.email || 'No email provided'}</p>
            <p className="text-gray-600 text-sm">{order.user?.phone || order.shippingAddress?.phone || 'No phone provided'}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><MapPin size={14} /> Shipping Address</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {order.shippingAddress?.line1}<br />
              {order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress?.state}` : ''} {order.shippingAddress?.pincode}<br />
              {order.shippingAddress?.country || 'India'}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col h-full">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><CreditCard size={14} /> Payment Details</h3>
            <p className="text-gray-700 text-sm mb-3"><span className="font-medium">Method:</span> {order.payment?.method || 'N/A'}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-700 text-sm font-medium">Status:</span> 
              <select 
                value={order.payment?.status || 'PENDING'} 
                onChange={handlePaymentStatusChange}
                disabled={updating}
                className={`text-xs font-bold uppercase tracking-widest py-1 px-2 border rounded-sm outline-none cursor-pointer ${
                  order.payment?.status === 'PAID' ? 'text-green-700 bg-green-50 border-green-200' : 
                  order.payment?.status === 'FAILED' ? 'text-red-700 bg-red-50 border-red-200' :
                  order.payment?.status === 'REFUNDED' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                  'text-amber-700 bg-amber-50 border-amber-200'
                }`}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            {order.payment?.gatewayPaymentId && (
               <p className="text-gray-700 text-xs break-all mb-3"><span className="font-medium">Txn ID:</span> {order.payment.gatewayPaymentId}</p>
            )}
            
            <p className="text-gray-700 text-sm font-bold mt-auto border-t border-gray-200 pt-3">Total: ₹{(order.totalAmount || order.totalPrice || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Order Items */}
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><Package size={14} /> Items Ordered</h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-gray-500">Product</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-gray-500">Price</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-gray-500 text-center">Qty</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-gray-500 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md p-1">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />}
                      </div>
                      <span className="font-bold text-sm text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">₹{(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                  <td className="p-4 text-sm font-bold text-gray-900 text-right">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Expense Breakdown Section */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="space-y-3 text-sm text-gray-600">
              
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-gray-900">₹{(order.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                  <span>- ₹{(order.discountAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax Amount {taxPercentage > 0 ? `(${taxPercentage}%)` : ''}:</span>
                  <span className="font-medium text-gray-900">₹{(order.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium text-gray-900">{order.shippingCharge > 0 ? `₹${(order.shippingCharge).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Free'}</span>
              </div>
              
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="font-bold text-gray-900">Grand Total:</span>
              <span className="text-xl font-black text-gray-900">₹{(order.totalAmount || order.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;