import React, { useMemo } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data'; 
import { useCart } from '../context/CartContext';

const BestSellers = () => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  // PERFORMANCE BOOST: Caches the bestsellers so the browser doesn't calculate this on every scroll/render
  const bestSellers = useMemo(() => {
    // Assuming the first 4 products in your data are bestsellers for this example
    return products.slice(0, 4);
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  if (!bestSellers || bestSellers.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-white border-t border-gray-100 select-none">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-[10px] md:text-xs font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-3 block">
            Most Loved
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            Best Sellers
          </h2>
          <div className="w-16 h-[2px] bg-[#C5A059] mt-6"></div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <div key={product.id} className="w-full bg-white flex flex-col group/card h-full rounded-sm border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-500">
              
              <Link to={`/product/${product.id}`} className="relative w-full aspect-[4/5] bg-[#F9F9F9] overflow-hidden block rounded-t-sm flex-shrink-0">
                {product.sale && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 z-20 shadow-sm">
                    Sale
                  </div>
                )}

                {/* PERFORMANCE FIX: decoding="async" prevents visual lag */}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105 pointer-events-none mix-blend-multiply"
                />

                <div className="hidden lg:flex absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 items-center justify-center gap-3 z-10">
                   <button 
                      onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`); }} 
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
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1.5">
                  {product.category || "ALDAY"}
                </p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 hover:text-[#C5A059] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-4 md:mb-5 mt-auto">
                  {product.price < product.mrp && (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;