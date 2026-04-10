import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Heart, Star, RefreshCw, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useWishlist } from '../context/WishlistContext';

//  1. Import the global context
import { useProducts } from '../context/ProductContext'; 

//  SAFETY ARMOR: Protects React from crashing if the DB sends weird objects
const safeText = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (Array.isArray(value)) {
    if (typeof value[0] === 'object') return fallback;
    return value.join(', '); 
  }
  return fallback;
};

const DiscoverMore = () => {
  const navigate = useNavigate();
  
  const cartContext = useCart() || {};
  const wishlistContext = useWishlist() || {};
  const { addToCart, setIsCartOpen } = cartContext;
  const { toggleWishlist, isInWishlist } = wishlistContext;

  //  2. Instantly grab the data and loading state from global context
  const { products, isLoading } = useProducts();

  const [randomProducts, setRandomProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addingState, setAddingState] = useState({}); 

  //  3. Shuffle products instantly once they load into the context
  useEffect(() => {
    if (products && products.length > 0) {
      const activeProducts = products.filter(p => p.status !== 'Draft'); // Optional: only show active ones
      const shuffled = [...activeProducts].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 4));
    }
  }, [products]);

  const shuffleProducts = () => {
    if (!products || products.length === 0) return;
    
    setIsRefreshing(true);
    // Add a tiny delay just for the UI animation effect
    setTimeout(() => {
      const activeProducts = products.filter(p => p.status !== 'Draft');
      const shuffled = [...activeProducts].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 4));
      setIsRefreshing(false);
    }, 400); 
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    const productId = product._id || product.id;
    setAddingState(prev => ({ ...prev, [productId]: true }));
    
    setTimeout(() => {
      if (addToCart) addToCart(product);
      if (setIsCartOpen) setIsCartOpen(true);
      setAddingState(prev => ({ ...prev, [productId]: false }));
    }, 600); 
  };

  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleWishlist) toggleWishlist(product);
  };

  if (!isLoading && randomProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FBFBFB] border-t border-gray-100 select-none overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        <div className="flex flex-col items-center text-center mb-10 md:mb-16 relative">
          <span className="text-[10px] md:text-xs font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-3 block">
            Curated For You
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-[#12221A] flex items-center justify-center gap-4">
            Discover More
          </h2>
          <div className="w-16 md:w-20 h-1 bg-[#C5A059] mt-6"></div>
          
          <button 
            onClick={shuffleProducts}
            disabled={isRefreshing || isLoading}
            className="mt-6 md:mt-0 md:absolute md:right-0 md:bottom-0 flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#12221A] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={`${isRefreshing ? 'animate-spin text-[#C5A059]' : ''}`} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 size={40} className="animate-spin text-[#C5A059] mb-4" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Curating Collection...</span>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-500 ease-in-out ${isRefreshing ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
              
              {randomProducts.map((product) => {
                const productId = product._id || product.id;
                
                return (
                  <div 
                    key={productId} 
                    className="flex flex-col group/card h-full bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-sm transition-all duration-500 border border-transparent hover:border-gray-100 overflow-hidden"
                  >
                    
                    <div className="relative mb-5 bg-[#F4F4F4] aspect-[4/5] overflow-hidden">
                      
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 translate-x-10 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-400 ease-out">
                         <button onClick={(e) => handleWishlistClick(e, product)} className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#12221A] hover:text-white transition-colors group/btn">
                            <Heart size={16} fill={isInWishlist?.(productId) ? "#C5A059" : "none"} className={isInWishlist?.(productId) ? "text-[#C5A059] group-hover/btn:text-[#C5A059]" : ""} />
                         </button>
                         <button onClick={(e) => { e.preventDefault(); navigate(`/product/${productId}`); }} className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#12221A] hover:text-white transition-colors">
                            <Eye size={16} />
                         </button>
                      </div>

                      <Link to={`/product/${productId}`} className="block h-full">
                        <img 
                          src={product.image || product.imageUrl || "https://via.placeholder.com/300"} 
                          alt={safeText(product.name)} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover/card:scale-105 mix-blend-multiply p-4" 
                          loading="lazy"
                        />
                      </Link>

                      {product.mrp && product.price < product.mrp && (
                        <span className="absolute top-4 left-4 bg-[#12221A] text-[#C5A059] text-[8px] md:text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] shadow-lg">Sale</span>
                      )}
                    </div>

                    <div className="text-center flex flex-col flex-1 px-4 pb-6">
                        
                        <p className="text-[8px] md:text-[9px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-2">
                          {safeText(product.category || product.concern, "ALDAY")}
                        </p>
                        
                        <Link to={`/product/${productId}`} className="block group-hover/card:text-[#C5A059] transition-colors mb-3">
                            <h6 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[40px] tracking-tight">
                              {safeText(product.name, "Clinical Formulation")}
                            </h6>
                        </Link>
                        
                        <div className="flex items-center justify-center gap-0.5 mb-3">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={10} className="text-[#C5A059] fill-[#C5A059]" />
                           ))}
                           <span className="text-[9px] text-gray-400 ml-1.5 font-bold">
                             ({Array.isArray(product.reviews) ? product.reviews.length : (product.reviewCount || Math.floor(Math.random() * 200) + 20)})
                           </span>
                        </div>

                        <div className="flex justify-center items-center gap-3 mb-6 mt-auto">
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-gray-400 text-[10px] md:text-xs line-through font-light">₹{product.mrp}</span>
                            )}
                            <span className="text-base md:text-lg font-black text-[#12221A]">₹{product.price}</span>
                        </div>
                        
                        <button 
                           onClick={(e) => handleAddToCart(e, product)} 
                           disabled={addingState[productId]}
                           className="w-full bg-white border border-gray-200 text-[#12221A] py-3.5 md:py-4 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em] group-hover/card:bg-[#12221A] group-hover/card:text-[#C5A059] group-hover/card:border-[#12221A] transition-all duration-300 rounded-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {addingState[productId] ? (
                            <><RefreshCw size={14} className="animate-spin" /> Adding...</>
                          ) : (
                            <><ShoppingBag size={14} /> Add To Bag</>
                          )}
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 md:mt-16 text-center">
              <Link 
                to="/view-all" 
                className="inline-flex items-center gap-3 border border-[#12221A] text-[#12221A] px-8 md:px-10 py-3 md:py-4 rounded-none text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#12221A] hover:text-[#C5A059] transition-all duration-300 group shadow-lg"
              >
                Explore Full Collection
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default DiscoverMore;