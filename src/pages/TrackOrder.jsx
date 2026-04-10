import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 🔥 Added useLocation
import { Package, Truck, CheckCircle, Search, ChevronRight, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axiosInstance'; 

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation(); // 🔥 1. Initialize useLocation

  // 🔥 2. Catch the data sent from the Account or Admin page instantly!
  useEffect(() => {
    if (location.state && location.state.orderData) {
      const incomingOrder = location.state.orderData;
      setOrderId(incomingOrder.orderNumber || incomingOrder._id.slice(-8).toUpperCase());
      setOrderData(incomingOrder);
      setShowStatus(true);
    }
  }, [location]);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setShowStatus(false);

    try {
      const token = localStorage.getItem('alday_auth_token');
      
      if (!token) {
        setError("Please log in to your account to track your orders.");
        setLoading(false);
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await API.get('/order/my', config);
      
      let rawOrders = [];
      if (res.data && Array.isArray(res.data.orders)) rawOrders = res.data.orders;
      else if (res.data && Array.isArray(res.data.data)) rawOrders = res.data.data;
      else if (Array.isArray(res.data)) rawOrders = res.data;

      const foundOrder = rawOrders.find(o => 
        o.orderNumber?.toLowerCase() === orderId.toLowerCase().trim() || 
        o._id === orderId.trim()
      );

      if (foundOrder) {
        setOrderData(foundOrder);
        setShowStatus(true);
      } else {
        setError("Order not found. Please verify your Order ID.");
      }
    } catch (err) {
      console.error("Tracking Error:", err);
      setError("Failed to track order. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (order) => {
    if (!order) return [];

    const history = order.statusHistory || [];
    const currentStatus = order.status || 'PENDING';

    const findDate = (statuses) => {
      const entry = history.slice().reverse().find(h => statuses.includes(h.status));
      if (entry) {
        const d = new Date(entry.changedAt || entry.date || new Date());
        return {
          date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return { date: 'Pending', time: '-' };
    };

    const placed = findDate(['PENDING', 'CONFIRMED']);
    if (placed.date === 'Pending' && order.createdAt) {
      const d = new Date(order.createdAt);
      placed.date = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      placed.time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    
    const processing = findDate(['PROCESSING']);
    const shipped = findDate(['SHIPPED']);
    const delivered = findDate(['DELIVERED']);

    if (currentStatus === 'CANCELLED') {
      const cancelled = findDate(['CANCELLED']);
      return [
        { status: 'Order Placed', ...placed, completed: true, icon: <Package size={20}/> },
        { status: 'Cancelled', ...cancelled, completed: true, icon: <XCircle size={20}/> }
      ];
    }

    const statusLevels = { 'PENDING': 1, 'CONFIRMED': 1, 'PROCESSING': 2, 'SHIPPED': 3, 'DELIVERED': 4, 'RETURNED': 4 };
    const currentLevel = statusLevels[currentStatus] || 1;

    return [
      { status: 'Order Placed', ...placed, completed: currentLevel >= 1, icon: <Package size={20}/> },
      { status: 'Processing', ...processing, completed: currentLevel >= 2, icon: <Clock size={20}/> },
      { status: 'Shipped', ...shipped, completed: currentLevel >= 3, icon: <Truck size={20}/> },
      { status: 'Delivered', ...delivered, completed: currentLevel >= 4, icon: <CheckCircle size={20}/> },
    ];
  };

  const getExpectedArrival = (order) => {
    if (!order) return '-';
    if (order.status === 'DELIVERED') return 'Delivered';
    if (order.status === 'CANCELLED') return 'Cancelled';
    
    if (order.estimatedDelivery) {
      return new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    const d = new Date(order.createdAt);
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const trackingSteps = generateTimeline(orderData);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="max-w-[1200px] mx-auto px-6 py-20 ">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">Track Your Journey</h1>
            <p className="text-gray-500 font-light">Enter your order ID to see exactly where your clinical nutrition is.</p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 mb-8 bg-gray-50 p-2 rounded-sm border border-gray-100 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Order ID (e.g. ORD-20240315-0001)" 
                className="w-full bg-white border border-gray-200 py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-black transition-colors"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black text-white px-8 md:px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center min-w-[120px]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Track"}
            </button>
          </form>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-sm border border-red-100 font-medium text-sm flex items-center gap-3 animate-fade-in">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {showStatus && orderData ? (
            <div className="animate-fade-in-up">
              <div className="flex flex-wrap justify-between items-center bg-[#12221A] text-white p-6 rounded-t-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-green-300 mb-1">Tracking Number</p>
                  <p className="text-lg font-bold"># {orderData.orderNumber || orderData._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-green-300 mb-1">Expected Arrival</p>
                  <p className={`text-lg font-bold ${orderData.status === 'CANCELLED' ? 'text-red-400' : 'text-[#C5A059]'}`}>
                    {getExpectedArrival(orderData)}
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 border-t-0 p-8 md:p-12 relative bg-white">
                <div className="space-y-12">
                  {trackingSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-6 relative group">
                      
                      {idx !== trackingSteps.length - 1 && (
                        <div className={`absolute left-[19px] top-10 w-[2px] h-12 ${step.completed ? 'bg-black' : 'bg-gray-200'}`}></div>
                      )}

                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${step.completed ? (step.status === 'Cancelled' ? 'bg-red-600 text-white' : 'bg-black text-white') : 'bg-gray-100 text-gray-400'}`}>
                        {step.icon}
                      </div>

                      <div className="flex flex-1 flex-col sm:flex-row sm:justify-between sm:items-start pt-1">
                        <div className="mb-2 sm:mb-0">
                          <h4 className={`text-sm font-bold uppercase tracking-widest mb-1 ${step.completed ? (step.status === 'Cancelled' ? 'text-red-600' : 'text-black') : 'text-gray-400'}`}>
                            {step.status}
                          </h4>
                          <p className="text-xs text-gray-500 font-light">
                            {step.completed ? 'Successfully updated' : 'Pending update'}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${step.completed ? 'text-black' : 'text-gray-300'}`}>{step.date}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{step.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
                   <Link to="/view-all" className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-[#C5A059] transition-colors">
                      Continue Shopping <ChevronRight size={16} />
                   </Link>
                </div>
              </div>
            </div>
          ) : !loading && !error && (
             <div className="text-center py-10 opacity-30">
                <Package size={80} className="mx-auto mb-4" strokeWidth={0.5} />
                <p className="text-xs uppercase tracking-widest">Enter a valid ID to begin tracking</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrackOrder;