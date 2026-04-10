import React from 'react';
import { ShoppingCart, Eye, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
//  1. Import the global context
import { useProducts } from '../context/ProductContext';

//  SAFETY ARMOR
const safeText = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (Array.isArray(value)) {
    if (typeof value[0] === 'object') return fallback;
    return value.join(', '); 
  }
  return fallback;
};

const BestSellers = () => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  
  //  2. Instantly grab the data from global state!
  const { products, isLoading } = useProducts();

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 md:py-24 bg-white border-t border-gray-100 flex justify-center items-center">
         <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </section>
    );
  }

  //  3. Calculate bestsellers instantly (no useEffect needed)
  let bestSellers = products.filter(product => product.bestSeller === true);
  if (bestSellers.length === 0) {
    bestSellers = products.slice(0, 4); // Fallback if none are starred
  } else {
    bestSellers = bestSellers.slice(0, 4); // Cap at 4
  }

  if (!bestSellers || bestSellers.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-white border-t border-gray-100 select-none">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-[10px] md:text-xs font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-3 block">
            Most Loved
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            Best Sellers
          </h2>
          <div className="w-16 h-[2px] bg-[#C5A059] mt-6"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {bestSellers.map((product) => {
            const uniqueId = product.productId || product._id;
            
            //  SECURED CATEGORY DISPLAY
            const displayCategory = safeText(product.category, "ALDAY");

            return (
              <div key={uniqueId} className="w-full bg-white flex flex-col group/card h-full rounded-sm border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-500">
                
                <Link to={`/product/${uniqueId}`} className="relative w-full aspect-[4/5] bg-[#F9F9F9] overflow-hidden block rounded-t-sm flex-shrink-0">
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    {product.sale && (
                      <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 shadow-sm w-fit">
                        Sale
                      </span>
                    )}
                    {product.bestSeller && (
                      <span className="bg-black text-[#C5A059] border border-[#C5A059]/30 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 shadow-md w-fit">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <img
                    src={product.image}
                    alt={safeText(product.name, "Product")}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105 pointer-events-none mix-blend-multiply"
                  />

                  <div className="hidden lg:flex absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 items-center justify-center gap-3 z-10">
                     <button 
                        onClick={(e) => { e.preventDefault(); navigate(`/product/${uniqueId}`); }} 
                        className="bg-white p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover/card:translate-y-0 duration-300"
                     >
                        <Eye size={16} />
                     </button>
                     <button 
                        onClick={(e) => handleAddToCart(e, product)} 
                        className="bg-white p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover/card:translate-y-0 duration-500"
                     >
                        <ShoppingCart size={16} />
                     </button>
                  </div>
                </Link>

                <div className="p-4 md:p-5 flex-1 flex flex-col items-center text-center">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1.5 line-clamp-1">
                    {displayCategory}
                  </p>
                  <Link to={`/product/${uniqueId}`}>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 hover:text-[#C5A059] transition-colors line-clamp-1">
                      {safeText(product.name, "Clinical Formulation")}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-4 md:mb-5 mt-auto">
                    {product.mrp > product.price && (
                      <span className="text-xs text-gray-400 line-through font-light">₹{product.mrp}</span>
                    )}
                    <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                  </div>
                  <button 
                     onClick={(e) => handleAddToCart(e, product)} 
                     className="w-full bg-black text-white py-3 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#C5A059] transition-colors rounded-sm flex items-center justify-center gap-2"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;