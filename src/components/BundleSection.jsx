import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus, Loader2, Package } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
//  1. Import the global context
import { useProducts } from '../context/ProductContext'; 

const BundleSection = () => {
  const { addToCart, setIsCartOpen } = useCart();
  
  //  2. Instantly grab the data from global state!
  const { products, isLoading } = useProducts();
  
  // We only need local state to track the "Plus/Minus" buttons now
  const [quantities, setQuantities] = useState({});

  if (isLoading) {
    return (
      <section className="py-24 bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#C5A059]" />
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Curating Bundles...</p>
      </section>
    );
  }

  //  3. Calculate bundles instantly (no useEffect needed)
  const bundles = products.filter(p => {
    const categoryStr = Array.isArray(p.category) ? p.category.join(' ').toLowerCase() : (p.category || '').toLowerCase();
    const nameStr = (p.name || '').toLowerCase();
    
    return categoryStr.includes('bundle') || categoryStr.includes('kit') || categoryStr.includes('routine') ||
           nameStr.includes('bundle') || nameStr.includes('kit') || nameStr.includes('routine');
  });

  if (bundles.length === 0) {
    return null; // Gracefully hide the section if no bundles exist in the database
  }

  // Helper to safely update quantity
  const updateQty = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change), 
    }));
  };

  // FULLY FUNCTIONAL ADD TO CART HANDLER
  const handleAddBundleToCart = (bundle) => {
    const bundleId = bundle._id || bundle.id;
    const qty = quantities[bundleId] || 1; // Defaults to 1 automatically

    // Check stock safety
    if (bundle.countInStock <= 0) {
      alert("This bundle is currently out of stock!");
      return;
    }

    addToCart(bundle, qty);
    setIsCartOpen(true); 
  };

  return (
    <section className="py-16 md:py-24 bg-white select-none border-t border-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-3 block">Curated Kits</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Complete Your Regimen</h2>
        </div>

        {bundles.map((bundle, index) => {
          const bundleId = bundle._id || bundle.id;
          const isOutOfStock = bundle.countInStock <= 0;
          const currentQty = quantities[bundleId] || 1;
          const price = bundle.price || 0;
          const mrp = bundle.mrp || 0;
          const imageSrc = bundle.image || bundle.imageUrl || "https://via.placeholder.com/500";

          return (
            <div 
              key={bundleId} 
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12 lg:gap-20 mb-20 md:mb-32 last:mb-0 border-b last:border-0 border-gray-100 pb-16 md:pb-20 last:pb-0`}
            >
              
              {/* Image Container */}
              <div className="w-full md:w-1/2 relative bg-[#F9F9F9] rounded-xl overflow-hidden aspect-square md:aspect-auto md:h-[550px] flex items-center justify-center p-6 md:p-8 group">
                <img 
                  src={imageSrc} 
                  alt={bundle.name} 
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {mrp > price && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider z-10 shadow-sm rounded-sm">
                    Save {Math.round(((mrp - price) / mrp) * 100)}%
                  </span>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <span className="bg-black text-white px-6 py-2 uppercase tracking-widest font-bold text-xs rounded-sm">Sold Out</span>
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="font-bold tracking-widest uppercase text-[10px] md:text-xs mb-3 block text-[#C5A059]">
                  {Array.isArray(bundle.category) ? bundle.category.join(', ') : (bundle.category || 'Exclusive Bundle')}
                </span>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-black leading-tight">
                  {bundle.name}
                </h2>
                
                <p className="text-sm md:text-base text-gray-500 mb-6 leading-relaxed font-light">
                  {bundle.description || bundle.subtitle || "A complete clinical routine designed for maximum efficacy and targeted results."}
                </p>

                {/* Bundle Sub-items or Bullet Points */}
                <div className="space-y-3 mb-8 md:mb-10 bg-gray-50 p-5 rounded-lg border border-gray-100">
                  {bundle.items && bundle.items.length > 0 ? (
                    bundle.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Package size={16} className="text-[#C5A059] flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800">{item.name || item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col gap-2">
                       <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">What's Inside:</p>
                       <div className="flex items-start gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 flex-shrink-0" />
                         <p className="text-sm text-gray-700">Full-size clinical formulations designed to work synergistically.</p>
                       </div>
                       <div className="flex items-start gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 flex-shrink-0" />
                         <p className="text-sm text-gray-700">Zero dilution, 100% active ingredients.</p>
                       </div>
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-4 mb-6">
                  <span className="text-3xl font-black text-gray-900">₹{price}</span>
                  {mrp > price && (
                    <span className="text-lg text-gray-400 line-through mb-1">₹{mrp}</span>
                  )}
                </div>

                {/* Add to Cart Actions */}
                <div className="flex gap-3 md:gap-4 h-[50px] md:h-[56px]">
                  
                  {/* Quantity Selector */}
                  <div className={`flex items-center border border-gray-300 w-28 md:w-32 justify-between px-3 md:px-4 bg-[#FBFBFB] rounded-sm shrink-0 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button onClick={() => updateQty(bundleId, -1)} disabled={isOutOfStock} className="text-gray-500 hover:text-black py-2"><Minus size={14} /></button>
                    <span className="font-bold text-sm">{currentQty}</span>
                    <button onClick={() => updateQty(bundleId, 1)} disabled={isOutOfStock} className="text-gray-500 hover:text-black py-2"><Plus size={14} /></button>
                  </div>
                  
                  {/* Main Add Button */}
                  <button 
                    onClick={() => handleAddBundleToCart(bundle)}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-md active:scale-[0.98] ${
                      isOutOfStock 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                        : 'bg-black text-white hover:bg-[#C5A059] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgba(197,160,89,0.3)]'
                    }`}
                  >
                    {isOutOfStock ? (
                      "Unavailable"
                    ) : (
                      <>
                        <ShoppingBag size={16} className="hidden sm:block mb-0.5" />
                        <span className="truncate">Add To Bag • ₹{(price * currentQty).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>

                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default BundleSection;