import React, { useRef, useState, useEffect } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

// 🔥 SAFETY ARMOR: Prevents crashes if DB sends objects instead of text
const safeText = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (Array.isArray(value)) {
    if (typeof value[0] === 'object') return fallback; // Array of objects
    return value.join(', '); // Array of strings
  }
  return fallback; // Raw object
};

const ProductSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const scrollRef = useRef(null);
  const isPaused = useRef(false); 
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://aldey-backend.vercel.app/api/product?limit=1000');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        const fetchedProducts = data.data || data.products || [];
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []); 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const scrollContainer = scrollRef.current;
    let animationId;
    
    const scroll = () => {
      if (scrollContainer && !isPaused.current) {
        const halfWidth = scrollContainer.scrollWidth / 2;
        
        if (scrollContainer.scrollLeft >= halfWidth) {
          scrollContainer.scrollLeft = 0; 
        } else {
          scrollContainer.scrollLeft += 1; 
        }

        let progress = (scrollContainer.scrollLeft / halfWidth) * 100;
        if (progress > 100) progress = 100;
        setScrollProgress(progress);
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [products]);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
  };

  if (isLoading) {
    return <div className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div></div>;
  }
  
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white py-20 relative overflow-hidden select-none">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 mb-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-gray-900">
            Just Arrived
          </h2>
          <div className="w-20 h-1 bg-black mx-auto mt-4 mb-6"></div>
        </div>
      </div>

      <div className="pl-6">
        <div 
          ref={scrollRef}
          onMouseEnter={() => isPaused.current = true}
          onMouseLeave={() => isPaused.current = false}
          onTouchStart={() => isPaused.current = true}
          onTouchEnd={() => isPaused.current = false}
          className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 pb-4"
          style={{ scrollBehavior: 'auto', pointerEvents: 'auto' }}
        >
          {products.map((product, idx) => (
            <ProductCard 
              key={`a-${product._id || product.id}-${idx}`} 
              product={product} 
              navigate={navigate} 
              handleAddToCart={handleAddToCart} 
            />
          ))}
          {products.map((product, idx) => (
            <ProductCard 
              key={`b-${product._id || product.id}-${idx}`} 
              product={product} 
              navigate={navigate} 
              handleAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-6 md:mt-10">
        <div className="w-full h-[3px] bg-gray-200 relative overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-black rounded-full"
            style={{ 
              width: '20%', 
              transform: `translateX(${scrollProgress * 4}%)` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// --- EXTRACTED PRODUCT CARD ---
const ProductCard = ({ product, navigate, handleAddToCart }) => {
  const productId = product._id || product.id; 

  return (
    <div className="w-[calc(50vw-1.5rem)] md:w-[300px] lg:w-[320px] flex-shrink-0 bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group/card">
      <Link to={`/product/${productId}`} className="relative w-full aspect-[4/5] bg-[#f9f9f9] overflow-hidden block">
        <img
          src={product.image || product.imageUrl || "https://via.placeholder.com/300"}
          alt={safeText(product.name, "Product")}
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover/card:scale-110 mix-blend-multiply pointer-events-none"
        />
        
        {product.sale && (
          <span className="absolute top-2 md:top-4 left-2 md:left-4 bg-red-600 text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 uppercase tracking-tighter z-10">
            Sale
          </span>
        )}

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-4">
           <button 
              onClick={(e) => { e.preventDefault(); navigate(`/product/${productId}`); }} 
              className="bg-white p-2.5 md:p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors transform translate-y-4 group-hover/card:translate-y-0 duration-300"
           >
              <Eye size={16} className="md:w-[18px] md:h-[18px]" />
           </button>
           <button 
              onClick={(e) => handleAddToCart(e, product)} 
              className="bg-white p-2.5 md:p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors transform translate-y-4 group-hover/card:translate-y-0 duration-500"
           >
              <ShoppingCart size={16} className="md:w-[18px] md:h-[18px]" />
           </button>
        </div>
      </Link>

      <div className="p-4 md:p-6 flex-1 flex flex-col text-center">
        {/* 🔥 APPLY ARMOR TO TEXT FIELDS */}
        <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1.5 md:mb-2 line-clamp-1">
          {safeText(product.vendor, "ALDAY")}
        </p>
        <Link to={`/product/${productId}`}>
          <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-snug mb-1.5 md:mb-2 hover:text-[#C5A059] transition-colors line-clamp-2 min-h-[34px] md:min-h-[40px]">
            {safeText(product.name, "Clinical Formulation")}
          </h3>
        </Link>
        <p className="text-[9px] md:text-[11px] text-gray-500 uppercase tracking-widest mb-3 md:mb-4 line-clamp-1">
          {safeText(product.concern, "Wellness")}
        </p>
        
        <div className="mt-auto pt-3 md:pt-4 border-t border-gray-50">
          <div className="flex justify-center items-center gap-2 md:gap-3">
            {product.price < product.mrp && (
              <span className="text-[10px] md:text-xs text-gray-400 line-through font-light">₹{product.mrp}</span>
            )}
            <span className="text-sm md:text-base font-black text-gray-900">₹{product.price}</span>
          </div>
        </div>
        
        <button 
           onClick={(e) => handleAddToCart(e, product)} 
           className="w-full mt-4 md:mt-6 bg-black text-white py-2.5 md:py-3 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all rounded-sm"
        >
          Add To Bag
        </button>
      </div>
    </div>
  );
};

export default ProductSection;