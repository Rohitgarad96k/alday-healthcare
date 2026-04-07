import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API from '../api/axiosInstance';
import {
  Package, MapPin, User as UserIcon, LogOut, ChevronRight,
  Heart, CreditCard, Gift, Settings, Download, Edit3, Trash2, ShieldCheck, Bell, Check, Menu, X
} from 'lucide-react'; // 🔥 Added Menu and X icons

const Account = () => {
  const { user, logout, setUser } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // 🔥 Added mobile nav state

  // --- BACKEND STATES ---
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const [savedAddress, setSavedAddress] = useState(() => {
    const addressData = localStorage.getItem(`alday_shipping_${user?._id || user?.id}`);
    return addressData ? JSON.parse(addressData) : null;
  });

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || user?.name || '',
    phone: user?.phone || ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) return <Navigate to="/login" replace />;

  const displayName = user.fullName || user.name || "User";

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoadingOrders(true);
      try {
        const token = localStorage.getItem('alday_auth_token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const res = await API.get('/order/my', config);

        let rawOrders = [];
        if (res.data && Array.isArray(res.data.orders)) {
          rawOrders = res.data.orders;
        } else if (Array.isArray(res.data)) {
          rawOrders = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          rawOrders = res.data.data;
        }

        const sortedOrders = [...rawOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('alday_auth_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await API.put('/auth/profile', profileData, config);

      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('alday_user', JSON.stringify(res.data.user));
      }

      showToast("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      return alert("Password must be at least 6 characters long.");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const token = localStorage.getItem('alday_auth_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await API.put('/auth/update-password', { password: passwordData.newPassword }, config);

      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      showToast("Password updated successfully!");
    } catch (error) {
      console.error("Password update failed:", error);
      alert(error.response?.data?.message || "Failed to update password.");
    }
  };

  // 🔥 Define tabs centrally to use in both mobile and desktop menus
  const tabsConfig = [
    { id: 'dashboard', icon: <UserIcon size={16} />, label: 'Dashboard' },
    { id: 'orders', icon: <Package size={16} />, label: 'Orders' },
    { id: 'wishlist', icon: <Heart size={16} />, label: 'Wishlist' },
    { id: 'addresses', icon: <MapPin size={16} />, label: 'Addresses' },
    { id: 'settings', icon: <Settings size={16} />, label: 'Settings' }
  ];

  const currentTabInfo = tabsConfig.find(t => t.id === activeTab);

  const renderTabContent = () => {
    switch (activeTab) {

      case 'dashboard':
        return (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6 hidden md:block">Account Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#12221A] text-white p-6 rounded-sm shadow-md relative overflow-hidden">
                <Package className="absolute -right-4 -bottom-4 text-white/10" size={100} />
                <p className="text-[10px] uppercase tracking-widest text-green-200 mb-1">Active Orders</p>
                <h3 className="text-4xl font-bold text-[#C5A059]">{orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length}</h3>
                <button onClick={() => setActiveTab('orders')} className="text-[10px] uppercase mt-2 text-gray-300 hover:text-white transition-colors z-10 relative">View Order History &rarr;</button>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Saved Items</p>
                <h3 className="text-3xl font-bold">{wishlistItems.length}</h3>
                <button onClick={() => setActiveTab('wishlist')} className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mt-2 text-left hover:text-black transition-colors z-10 relative">View Wishlist &rarr;</button>
              </div>
            </div>

            <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">Personal Details</h3>
                <button onClick={() => setActiveTab('settings')} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2">
                  <Edit3 size={14} /> Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-base font-medium">{displayName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-base font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-base font-medium">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6 hidden md:block">Order History</h2>

            {loadingOrders ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                <p className="text-gray-500 text-sm mb-6">When you place an order, it will appear here.</p>
                <Link to="/view-all" className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors rounded-sm">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
                    <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Order Number</p>
                        <p className="font-bold"># {order.orderNumber || order._id.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Date Placed</p>
                        <p className="font-bold">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Amount</p>
                        <p className="font-bold">₹{(order.totalAmount || order.totalPrice || order.price || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <span className={`text-[9px] font-bold uppercase px-3 py-1.5 rounded-sm tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border border-green-100' :
                            order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-100' :
                              'bg-yellow-50 text-yellow-700 border border-yellow-100'
                          }`}>
                          {order.status || 'PROCESSING'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <p className="text-sm text-gray-600 font-light">
                        {order.items?.length || order.orderItems?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'} in this order
                      </p>
                      <div className="flex gap-3">
                        {/* INVOICE BUTTON (Conditional) */}
                        {order.status === 'DELIVERED' ? (
                          <button
                            onClick={() => navigate('/invoice', { state: { orderData: order } })}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-white transition-colors border border-black px-4 py-3 rounded-sm hover:bg-black"
                          >
                            <Download size={14} /> Invoice
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-4 py-3 rounded-sm cursor-not-allowed bg-gray-50"
                            title="Invoice will be available once the order is delivered"
                          >
                            <Download size={14} /> Pending
                          </button>
                        )}

                        {/* TRACK ORDER BUTTON */}
                        <button
                          onClick={() => navigate('/track-order', { state: { orderData: order } })}
                          className="flex-1 sm:flex-none bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#C5A059] transition-colors"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'wishlist':
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6 hidden md:block">My Wishlist</h2>
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlistItems.map((item) => {
                  const uniqueId = item.productId || item._id || item.id;
                  return (
                    <div key={uniqueId} className="flex border border-gray-200 p-4 rounded-sm bg-white group transition-shadow hover:shadow-md">
                      <div className="w-24 h-24 bg-[#F9F9F9] flex-shrink-0">
                        <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                      </div>
                      <div className="ml-4 flex flex-col justify-center flex-1">
                        <p className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                          {Array.isArray(item.category) ? item.category.join(', ') : (item.category || 'Care')}
                        </p>
                        <Link to={`/product/${uniqueId}`} className="font-bold text-sm mb-1 hover:text-[#C5A059] transition-colors line-clamp-1">{item.name}</Link>
                        <p className="font-bold text-gray-900 mb-3 text-sm">₹{item.price}</p>
                        <div className="flex items-center gap-3 mt-auto">
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="bg-black text-white text-[9px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-sm hover:bg-[#C5A059] transition-colors"
                          >
                            Add to Bag
                          </button>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white p-12 text-center border border-gray-100 rounded-sm py-24">
                <Heart size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-sm text-gray-500 mb-6 font-light">Your wishlist is currently empty.</p>
                <Link to="/view-all" className="bg-black text-white px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors rounded-sm">Start Shopping</Link>
              </div>
            )}
          </div>
        );

      case 'addresses':
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold uppercase tracking-widest hidden md:block">Saved Addresses</h2>
              <button className="text-[10px] font-bold uppercase tracking-widest text-black hover:text-white transition-colors border border-black hover:bg-black px-4 py-2 rounded-sm ml-auto">
                + Add New
              </button>
            </div>

            {savedAddress ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FBFBFB] p-6 border border-gray-200 rounded-sm shadow-sm relative">
                  <span className="absolute top-6 right-6 bg-black text-white text-[9px] font-bold uppercase px-2.5 py-1 tracking-widest rounded-sm">Default</span>

                  <p className="font-bold text-sm mb-2 flex items-center gap-2">
                    {savedAddress.fullName || displayName} <ShieldCheck size={16} className="text-[#C5A059]" />
                  </p>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4 font-light">
                    {savedAddress.address}<br />
                    {savedAddress.city}{savedAddress.state ? `, ${savedAddress.state}` : ''} {savedAddress.pincode}<br />
                    India
                  </p>

                  <p className="text-sm text-gray-600 mb-6 font-light">Phone: {savedAddress.phone || user.phone || 'Not provided'}</p>

                  <div className="flex gap-4 border-t border-gray-200 pt-4">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-1.5">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem(`alday_shipping_${user?._id || user?.id}`);
                        setSavedAddress(null);
                        showToast("Address deleted successfully");
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold mb-2">No saved addresses</h3>
                <p className="text-gray-500 text-sm mb-6">Addresses used at checkout will be automatically saved here.</p>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6 hidden md:block">Profile Settings</h2>

            <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Personal Information</h3>
              <form className="space-y-6" onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full border border-gray-300 rounded-sm py-3.5 px-4 text-sm focus:border-black outline-none transition-colors bg-[#FBFBFB] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-sm py-3.5 px-4 text-sm focus:border-black outline-none transition-colors bg-[#FBFBFB] focus:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full border border-gray-200 bg-gray-50 rounded-sm py-3.5 px-4 text-sm text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
                <button type="submit" className="bg-black text-white px-10 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#C5A059] transition-all">
                  Save Changes
                </button>
              </form>
            </div>

            <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm transition-all duration-300">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">Security</h3>

                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-black hover:text-white transition-colors border border-black hover:bg-black px-4 py-2 rounded-sm"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {!showPasswordForm ? (
                <div className="animate-fade-in text-gray-500 font-light text-sm">
                  <p>Keep your account secure by updating your password regularly.</p>
                </div>
              ) : (
                <form className="space-y-6 animate-fade-in" onSubmit={handleUpdatePassword}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-sm py-3.5 px-4 text-sm focus:border-black outline-none bg-[#FBFBFB] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        className={`w-full border rounded-sm py-3.5 px-4 text-sm focus:border-black outline-none bg-[#FBFBFB] focus:bg-white transition-colors ${passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-300'
                          }`}
                      />
                      {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-red-500 text-[10px] mt-1 font-bold tracking-widest uppercase">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button type="submit" className="bg-black text-white px-10 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#C5A059] transition-all">
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ newPassword: '', confirmPassword: '' });
                      }}
                      className="text-gray-400 hover:text-black text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans text-gray-900 relative">

      <style>{`
        .App, main, body, html {
          overflow-x: clip !important; 
        }
      `}</style>

      {toastMsg && (
        <div className="fixed top-24 right-6 bg-black text-white px-6 py-3 rounded-sm shadow-2xl z-[200] animate-fade-in-up flex items-center gap-3 border border-gray-800">
          <Check size={16} className="text-[#C5A059]" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-12 ">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight mb-3">My Account</h1>
          <p className="text-gray-500 font-light text-sm">Welcome back, <span className="font-bold text-black uppercase tracking-widest text-xs ml-1">{displayName.split(' ')[0]}</span></p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 md:py-16 flex flex-col md:flex-row gap-10 items-start">

        {/* 🔥 NEW: Mobile Premium Menu Trigger Button */}
        <div className="w-full md:hidden mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Navigate To</p>
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 p-4 rounded-sm shadow-sm text-xs font-bold uppercase tracking-widest"
          >
            <span className="flex items-center gap-3 text-[#C5A059]">
              {currentTabInfo?.icon} {currentTabInfo?.label}
            </span>
            <Menu size={18} className="text-black" />
          </button>
        </div>

        {/* 🔥 NEW: Mobile Slide-Out Drawer overlay */}
        <div className={`md:hidden fixed inset-0 z-[200] transition-opacity duration-300 ${isMobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)} />

          {/* Drawer Panel */}
          <div className={`absolute inset-y-0 left-0 w-[280px] sm:w-[320px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FBFBFB]">
              <h2 className="font-serif font-bold text-lg tracking-widest uppercase">Menu</h2>
              <button onClick={() => setIsMobileNavOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {tabsConfig.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center p-4 px-6 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                      ? 'bg-[#FBFBFB] text-[#C5A059] border-l-2 border-l-[#C5A059]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black border-l-2 border-transparent'
                    }`}
                >
                  <span className="flex items-center gap-3">{tab.icon} {tab.label}</span>
                </button>
              ))}

              <div className="px-6 mt-8 border-t border-gray-100 pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-4 text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-100 hover:bg-red-50 rounded-sm transition-all"
                >
                  <LogOut size={14} className="mr-2" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ORIGINAL: Desktop Sidebar (Hidden on mobile now!) */}
        <div className="hidden md:block w-full md:w-1/4 md:sticky md:top-32 self-start z-10">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col shadow-sm">
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 px-6 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                    ? 'bg-[#FBFBFB] text-[#C5A059] border-l-2 border-l-[#C5A059]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black border-l-2 border-transparent'
                  }`}
              >
                <span className="flex items-center gap-3">{tab.icon} {tab.label}</span>
                <ChevronRight size={14} className="opacity-30" />
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 px-6 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all border-l-2 border-transparent"
            >
              <span className="flex items-center gap-3"><LogOut size={16} /> Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="w-full md:w-3/4 min-h-[500px]">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
};

export default Account;