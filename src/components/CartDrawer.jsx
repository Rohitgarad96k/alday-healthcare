import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  // Using cartItems based on your context structure
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Free Shipping Threshold logic
  const FREE_SHIPPING_THRESHOLD = 999;
  const currentTotal = getCartTotal();
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - currentTotal;
  const progressPercentage = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      {/* 1. Backdrop (Smooth fade transition) */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-400 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsCartOpen(false)}
      />

      {/* 2. Drawer Panel (Smooth slide transition) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[250] flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FBFBFB]">
          <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
            Your Bag <span className="text-sm font-sans font-normal text-gray-500">({cartItems?.length || 0})</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="p-2 hover:bg-white rounded-full transition-colors hover:shadow-sm"
          >
            <X size={20} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        {cartItems?.length > 0 && (
          <div className="p-5 border-b border-gray-100 bg-white">
            <p className="text-xs font-bold text-gray-800 mb-2">
              {amountToFreeShipping > 0 
                ? <>Add <span className="text-[#C5A059]">₹{amountToFreeShipping.toFixed(2)}</span> more for FREE SHIPPING</> 
                : <span className="text-green-600">You've unlocked FREE SHIPPING! 🎉</span>
              }
            </p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${amountToFreeShipping <= 0 ? 'bg-green-500' : 'bg-[#C5A059]'}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
          {!cartItems || cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                 <ShoppingBag size={32} className="text-gray-300" />
               </div>
               <p className="text-lg font-serif font-bold text-gray-900">Your bag is empty.</p>
               <p className="text-sm text-gray-500 max-w-[250px]">Looks like you haven't added any clinical essentials to your bag yet.</p>
               <button 
                 onClick={() => { setIsCartOpen(false); navigate('/view-all'); }}
                 className="mt-4 border border-black text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-sm"
               >
                 Start Shopping
               </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Product Image */}
                  <div className="w-20 h-24 bg-[#F9F9F9] flex-shrink-0 overflow-hidden rounded-sm border border-gray-100">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.category || "ALDAY"}</p>
                         <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-auto">
                       {/* Quantity Controls */}
                       <div className="flex items-center border border-gray-200 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors disabled:opacity-50" 
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                       </div>
                       {/* Price */}
                       <p className="font-black text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Subtotal & Checkout) */}
        {cartItems?.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-[#FBFBFB]">
            <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-bold uppercase tracking-widest text-gray-600">Subtotal</span>
               <span className="text-xl font-black text-gray-900">₹{getCartTotal().toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-6 font-light">Shipping & taxes calculated at checkout.</p>
            
            <Link 
              to="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-black text-white py-4 uppercase text-xs font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#C5A059] transition-all duration-300 rounded-sm shadow-lg group"
            >
              Checkout Securely <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;