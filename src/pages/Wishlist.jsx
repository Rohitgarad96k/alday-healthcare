import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  // Added safe fallbacks so the app never crashes if context is briefly unavailable
  const wishlistContext = useWishlist() || {};
  const wishlistItems = Array.isArray(wishlistContext.wishlistItems) ? wishlistContext.wishlistItems : [];
  const toggleWishlist = wishlistContext.toggleWishlist || (() => {});
  
  const cartContext = useCart() || {};
  const addToCart = cartContext.addToCart || (() => {});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12 md:py-20 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-2">My Wishlist</h1>
          <p className="text-gray-500">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-16 text-center flex flex-col items-center justify-center border border-gray-200">
            <Heart size={64} strokeWidth={1} className="text-gray-300 mb-6" />
            <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't saved anything yet. Explore our collections and find your new favorites.</p>
            <Link to="/view-all" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product, index) => {
              // Safely extract the ID regardless of how MongoDB formats it
              const uniqueId = product?.productId || product?._id || product?.id || index;

              return (
              <div key={uniqueId} className="bg-white flex flex-col group rounded-sm border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Image Area */}
                <div className="relative bg-[#F9F9F9] aspect-[4/5] overflow-hidden">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <Link to={`/product/${uniqueId}`}>
                    <img 
                      src={product?.image || product?.images?.[0] || "https://via.placeholder.com/300"} 
                      alt={product?.name || "Product"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply p-4" 
                    />
                  </Link>
                </div>

                {/* Details Area */}
                <div className="p-5 flex flex-col flex-1 text-center">
                  <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-bold mb-1">
                    {/* Fixed the mashed category text issue here too! */}
                    {Array.isArray(product?.category) ? product.category.join(', ') : (product?.category || 'Care')}
                  </p>
                  <Link to={`/product/${uniqueId}`} className="hover:text-gray-600 transition-colors">
                    <h4 className="font-bold text-sm leading-snug mb-3 line-clamp-2 min-h-[40px]">{product?.name || "Unnamed Product"}</h4>
                  </Link>
                  <p className="font-bold text-lg mb-6 mt-auto">₹{product?.price || 0}</p>
                  
                  <button 
                    onClick={() => addToCart(product, 1)}
                    className="w-full border border-black text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex justify-center items-center gap-2"
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                </div>

              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;