import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  Package, MapPin, User as UserIcon, LogOut, ChevronRight, 
  Heart, CreditCard, Gift, Settings, Star, Download, Edit3, Trash2, ShieldCheck, Bell
} from 'lucide-react';

const Account = () => {
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Route Protection
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safely get the user's name (whether the backend returns 'name' or 'fullName')
  const displayName = user.fullName || user.name || "User";

  // --- MOCK DATA FOR ORDERS ---
  const mockOrders = [
    { id: 'ALDAY-8832', date: 'Oct 12, 2023', status: 'Delivered', total: '₹2,450', items: 2 },
    { id: 'ALDAY-7511', date: 'Sep 04, 2023', status: 'In Transit', total: '₹1,200', items: 1 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      
      // 1. DASHBOARD
      case 'dashboard':
        return (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6">Account Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#12221A] text-white p-6 rounded-sm shadow-md relative overflow-hidden">
                <Gift className="absolute -right-4 -bottom-4 text-white/10" size={100} />
                <p className="text-[10px] uppercase tracking-widest text-green-200 mb-1">Alday Coins</p>
                <h3 className="text-4xl font-bold text-[#C5A059]">450</h3>
                <p className="text-[10px] uppercase mt-2">≈ ₹450 Store Credit</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Saved Items</p>
                <h3 className="text-3xl font-bold">{wishlistItems.length}</h3>
                <button onClick={() => setActiveTab('wishlist')} className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mt-2 text-left hover:text-black transition-colors">View Wishlist &rarr;</button>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Membership Tier</p>
                <h3 className="text-2xl font-bold flex items-center gap-2"><Star size={20} className="text-[#C5A059] fill-current" /> Gold</h3>
                <p className="text-[10px] text-gray-400 mt-2 tracking-widest uppercase">Free Shipping Unlocked</p>
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

      // 2. ORDERS
      case 'orders':
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6">Order History</h2>
            <div className="space-y-6">
              {mockOrders.map((order, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
                  <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Order Number</p>
                      <p className="font-bold"># {order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Date Placed</p>
                      <p className="font-bold">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Amount</p>
                      <p className="font-bold">{order.total}</p>
                    </div>
                    <div>
                      <span className={`text-[9px] font-bold uppercase px-3 py-1.5 rounded-sm tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <p className="text-sm text-gray-600 font-light">{order.items} Items in this order</p>
                    <div className="flex gap-3">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors border border-gray-200 px-4 py-3 rounded-sm hover:bg-gray-50">
                        <Download size={14} /> Invoice
                      </button>
                      <button 
                        onClick={() => navigate('/track-order')}
                        className="flex-1 sm:flex-none bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#C5A059] transition-colors"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 3. WISHLIST
      case 'wishlist':
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6">My Wishlist</h2>
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex border border-gray-200 p-4 rounded-sm bg-white group transition-shadow hover:shadow-md">
                    <div className="w-24 h-24 bg-[#F9F9F9] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                    </div>
                    <div className="ml-4 flex flex-col justify-center flex-1">
                      <p className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold mb-1">{item.category}</p>
                      <Link to={`/product/${item.id}`} className="font-bold text-sm mb-1 hover:text-[#C5A059] transition-colors line-clamp-1">{item.name}</Link>
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
                ))}
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

      // 4. ADDRESSES
      case 'addresses':
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold uppercase tracking-widest">Saved Addresses</h2>
              <button className="text-[10px] font-bold uppercase tracking-widest text-black hover:text-white transition-colors border border-black hover:bg-black px-4 py-2 rounded-sm">
                + Add New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FBFBFB] p-6 border border-gray-200 rounded-sm shadow-sm relative">
                <span className="absolute top-6 right-6 bg-black text-white text-[9px] font-bold uppercase px-2.5 py-1 tracking-widest rounded-sm">Default</span>
                <p className="font-bold text-sm mb-2 flex items-center gap-2">{displayName} <ShieldCheck size={16} className="text-[#C5A059]"/></p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 font-light">
                  123 Wellness Avenue, Bandra West<br />
                  Mumbai, Maharashtra 400050, India
                </p>
                <p className="text-sm text-gray-600 mb-6 font-light">Phone: {user.phone}</p>
                <div className="flex gap-4 border-t border-gray-200 pt-4">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"><Edit3 size={14}/> Edit</button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"><Trash2 size={14}/> Delete</button>
                </div>
              </div>
            </div>
          </div>
        );

      // 5. REWARDS
      case 'rewards':
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6">Alday Rewards</h2>
            <div className="bg-[#12221A] text-white p-8 md:p-12 rounded-sm shadow-xl relative overflow-hidden mb-8">
              <Gift className="absolute -right-10 -bottom-10 text-[#C5A059]/10 w-64 h-64" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold mb-2">Available Balance</p>
                  <h3 className="text-5xl font-serif font-black mb-2">450 <span className="text-xl font-sans font-light tracking-normal">Coins</span></h3>
                  <p className="text-sm text-gray-300 font-light">1 Coin = 1 Rupee. Automatically applied at checkout.</p>
                </div>
                <div className="w-full md:w-1/2 bg-white/5 p-6 rounded-sm backdrop-blur-sm border border-white/10">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                    <span className="text-white">Gold Member</span>
                    <span className="text-[#C5A059]">Platinum Goal</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
                    <div className="w-[60%] h-full bg-[#C5A059]"></div>
                  </div>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 text-center">Earn 550 more coins for Platinum Status</p>
                </div>
              </div>
            </div>
          </div>
        );

      // 6. SETTINGS
      case 'settings':
        return (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6">Profile Settings</h2>
            
            <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Personal Information</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                    <input type="text" defaultValue={displayName} className="w-full border border-gray-300 rounded-sm py-3.5 px-4 text-sm focus:border-black outline-none transition-colors bg-[#FBFBFB] focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                    <input type="tel" defaultValue={user.phone} className="w-full border border-gray-300 rounded-sm py-3.5 px-4 text-sm focus:border-black outline-none transition-colors bg-[#FBFBFB] focus:bg-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full border border-gray-200 bg-gray-50 rounded-sm py-3.5 px-4 text-sm text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
                <button className="bg-black text-white px-10 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#C5A059] transition-all">Save Changes</button>
              </form>
            </div>

            <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Security</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-md border border-gray-300 rounded-sm py-3.5 px-4 text-sm focus:border-black outline-none bg-[#FBFBFB] focus:bg-white" />
                </div>
                <button className="border border-black text-black px-10 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-black hover:text-white transition-all">Update Password</button>
              </form>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans text-gray-900 relative">

      {/* FORCE STICKY SUPPORT OVERRIDE */}
      <style>{`
        .App, main, body, html {
          overflow-x: clip !important; 
        }
      `}</style>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 pt-32 pb-12 mt-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight mb-3">My Account</h1>
          <p className="text-gray-500 font-light text-sm">Welcome back, <span className="font-bold text-black uppercase tracking-widest text-xs ml-1">{displayName.split(' ')[0]}</span></p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row gap-10 items-start">
        
        {/* SIDEBAR NAVIGATION (PERFECT STICKY) */}
        <div className="w-full md:w-1/4 md:sticky md:top-32 self-start z-10">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-row overflow-x-auto md:flex-col hide-scrollbar shadow-sm">
            
            {[
              { id: 'dashboard', icon: <UserIcon size={16} />, label: 'Dashboard' },
              { id: 'orders', icon: <Package size={16} />, label: 'Orders' },
              { id: 'wishlist', icon: <Heart size={16} />, label: 'Wishlist' },
              { id: 'rewards', icon: <Gift size={16} />, label: 'Rewards' },
              { id: 'addresses', icon: <MapPin size={16} />, label: 'Addresses' },
              { id: 'settings', icon: <Settings size={16} />, label: 'Settings' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 md:w-full flex items-center justify-between p-4 md:px-6 border-b md:border-r-0 border-gray-100 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-[#FBFBFB] text-[#C5A059] border-l-2 md:border-l-[#C5A059]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black border-l-2 border-transparent'
                }`}
              >
                <span className="flex items-center gap-3">{tab.icon} {tab.label}</span>
                <ChevronRight size={14} className="hidden md:block opacity-30" />
              </button>
            ))}

            <button 
              onClick={handleLogout}
              className="flex-shrink-0 md:w-full flex items-center justify-between p-4 md:px-6 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all border-l-2 border-transparent"
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