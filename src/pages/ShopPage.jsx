import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Filter, ChevronDown, Check, Heart, Eye, ArrowRight, ShoppingBag, Sliders } from 'lucide-react';
import { products } from '../data'; 
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- CRASH-PROOF CONTEXT EXTRACTION ---
  const cartContext = useCart() || {};
  const wishlistContext = useWishlist() || {};
  const { addToCart, setIsCartOpen } = cartContext;
  const { toggleWishlist, isInWishlist } = wishlistContext;

  // --- STATES ---
  const [category, setCategory] = useState("All");
  const [sortType, setSortType] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // --- INSTANT ROUTING FIX ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const params = new URLSearchParams(location.search);
    const catParam = params.get('cat');
    const searchParam = params.get('search');

    if (searchParam) {
      setSearchQuery(searchParam);
      setCategory("All"); 
    } else if (catParam) {
      setCategory(catParam);
      setSearchQuery(""); 
    } else {
      setCategory("All");
      setSearchQuery("");
    }
  }, [location.search]);

  // --- EXTREME PERFORMANCE FILTERING ENGINE ---
  const filteredData = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let result = [...products];

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => {
        const inName = (p?.name || "").toLowerCase().includes(query);
        const inConcern = (p?.concern || "").toLowerCase().includes(query);
        const inCategory = (p?.category || "").toLowerCase().includes(query);
        
        let inIngredients = false;
        if (Array.isArray(p.keyActives)) {
            inIngredients = p.keyActives.some(act => {
                if (typeof act === 'string') return act.toLowerCase().includes(query);
                if (act && act.name) return act.name.toLowerCase().includes(query);
                return false;
            });
        }
        return inName || inConcern || inCategory || inIngredients;
      });
    }

    // Category Filter
    if (category !== "All" && !searchQuery) {
      const lowerCat = category.toLowerCase();
      result = result.filter(p => {
        const searchableText = `${p?.category || ""} ${p?.concern || ""}`.toLowerCase();
        return searchableText.includes(lowerCat);
      });
    }

    // Price Filter
    result = result.filter(p => {
      const price = p?.price || 0;
      return price >= (priceRange.min || 0) && price <= (priceRange.max || 10000);
    });

    // Sorting Engine
    if (sortType === "low-high") result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    else if (sortType === "high-low") result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
    else if (sortType === "a-z") result.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
    else if (sortType === "z-a") result.sort((a, b) => (b?.name || "").localeCompare(a?.name || ""));

    return result;
  }, [category, sortType, searchQuery, priceRange]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- HANDLERS ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCart = (product) => {
    if (addToCart) addToCart(product); 
    if (setIsCartOpen) setIsCartOpen(true); 
    showToast(`Added ${product.name} to Cart`);
    if(quickViewProduct) setQuickViewProduct(null);
  };

  const handleToggleWishlist = (product) => {
    if (toggleWishlist) toggleWishlist(product);
    const isSaved = isInWishlist && isInWishlist(product.id);
    showToast(isSaved ? "Removed from Wishlist" : "Added to Wishlist");
  };

  const resetFilters = () => {
    setCategory("All");
    setSearchQuery("");
    setPriceRange({ min: 0, max: 10000 });
    setSortType("featured");
    setCurrentPage(1);
    navigate('/view-all');
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen pb-20 relative font-sans text-gray-900">
      
      {/* FORCE STICKY SUPPORT OVERRIDE */}
      <style>{`
        .App, main, body, html {
          overflow-x: clip !important; 
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-24 right-6 bg-black text-white px-6 py-3 rounded-sm shadow-2xl z-[200] animate-fade-in-up flex items-center gap-3 border border-gray-800">
          <Check size={16} className="text-[#C5A059]" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{toastMsg}</span>
        </div>
      )}

      {/* LUXURY HEADER */}
      <section className="bg-white py-16 md:py-28 border-b border-gray-100 relative overflow-hidden mt-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#C5A059]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.4em] font-bold block mb-4">Shop The Collection</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            {searchQuery ? `Results for "${searchQuery}"` : (category === "All" ? "Clinical Formulations" : category)}
          </h1>
          <div className="flex justify-center items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-black font-bold">Shop</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-16 relative">
          
          {/* =========================================
              LEFT SIDEBAR (PERFECT STICKY & SPACIOUS)
          ========================================== */}
          <aside className={`fixed inset-0 z-[100] lg:z-10 lg:static bg-white lg:bg-transparent px-8 py-12 lg:p-0 lg:pr-6 transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${showMobileFilters ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'} w-full sm:w-[350px] lg:w-full lg:col-span-1`}>
             
             <div className="lg:sticky lg:top-32 max-h-[calc(100vh-100px)] overflow-y-auto flex flex-col hide-scrollbar pb-12 pr-2">
                
                {/* Mobile Header */}
                <div className="flex justify-between items-center mb-10 lg:hidden border-b border-gray-100 pb-6">
                   <span className="text-xl font-serif font-bold tracking-wide flex items-center gap-3"><Sliders size={22}/> Filters</span>
                   <button onClick={() => setShowMobileFilters(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                </div>

                <div className="hidden lg:flex justify-between items-center mb-10 border-b border-gray-200 pb-5">
                  <h5 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Sliders size={16}/> Filter & Sort</h5>
                  {(category !== "All" || searchQuery || priceRange.max < 10000) && (
                    <button onClick={resetFilters} className="text-[#C5A059] hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">Reset</button>
                  )}
                </div>

                {/* Refined Categories */}
                <div className="mb-10">
                   <h6 className="font-bold text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-5 pl-1">Target Concerns</h6>
                   <ul className="space-y-1">
                      {['All', 'Hair Growth', 'Hair Fall', 'Dandruff', 'Skin Brightening', 'Acne Control', 'Face Serums', 'Body Care'].map(cat => (
                        <li key={cat}>
                           <button 
                             onClick={() => {setCategory(cat); setSearchQuery(""); setShowMobileFilters(false); setCurrentPage(1);}}
                             className={`w-full text-left text-sm py-3 px-4 rounded-sm transition-all duration-300 flex items-center justify-between group ${
                               category === cat 
                               ? 'bg-white text-[#C5A059] font-bold shadow-sm border border-gray-100' 
                               : 'text-gray-500 hover:text-black hover:bg-white border border-transparent'
                             }`}
                           >
                             <span>{cat}</span>
                             {category === cat && <ChevronDown size={14} className="-rotate-90 text-[#C5A059]"/>}
                           </button>
                        </li>
                      ))}
                   </ul>
                </div>

                {/* Minimalist Price Filter */}
                <div className="mb-10 pl-1">
                  <h6 className="font-bold text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-5">Price Range</h6>
                  <div className="flex items-center gap-4">
                    <div className="relative w-full">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                       <input type="number" className="w-full border border-gray-200 rounded-sm py-3 pl-8 pr-3 text-sm outline-none focus:border-black transition-colors bg-white font-medium shadow-sm" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} placeholder="0" />
                    </div>
                    <span className="text-gray-300">-</span>
                    <div className="relative w-full">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                       <input type="number" className="w-full border border-gray-200 rounded-sm py-3 pl-8 pr-3 text-sm outline-none focus:border-black transition-colors bg-white font-medium shadow-sm" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} placeholder="10000" />
                    </div>
                  </div>
                </div>

                <button onClick={resetFilters} className="w-full py-4 mt-4 border border-gray-900 text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-sm shadow-sm">
                   Clear All Filters
                </button>
             </div>
          </aside>

          {/* =========================================
              RIGHT: PRODUCT GRID AREA
          ========================================== */}
          <div className="lg:col-span-3 w-full">
            
            {/* Elegant Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-5 border-b border-gray-200 gap-4">
              <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-6 py-3.5 rounded-sm shadow-lg w-full sm:w-auto">
                <Filter size={14} /> Filter
              </button>
              
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hidden lg:block">
                Showing <span className="text-black">{currentItems.length}</span> of {filteredData.length} Results
              </span>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block whitespace-nowrap">Sort By:</label>
                <div className="relative w-full sm:w-auto group">
                  <select 
                    className="appearance-none w-full min-w-[200px] bg-white border border-gray-200 text-[10px] md:text-xs font-bold uppercase tracking-widest outline-none cursor-pointer py-3.5 pl-5 pr-12 rounded-sm group-hover:border-black transition-colors shadow-sm" 
                    value={sortType} 
                    onChange={(e) => {setSortType(e.target.value); setCurrentPage(1);}}
                  >
                    <option value="featured">Featured</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                    <option value="a-z">Alphabetical (A-Z)</option>
                    <option value="z-a">Alphabetical (Z-A)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16 min-h-[600px]"> 
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <div className="flex flex-col group/card h-full bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-sm transition-all duration-500 border border-transparent hover:border-gray-100 overflow-hidden" key={product.id}>
                    
                    {/* Image Container with Extreme Speed */}
                    <div className="relative mb-5 bg-[#F4F4F4] aspect-[4/5] overflow-hidden">
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 translate-x-10 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-400 ease-out">
                         <button onClick={() => handleToggleWishlist(product)} className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-colors group/btn">
                            <Heart size={16} fill={isInWishlist?.(product.id) ? "#C5A059" : "none"} className={isInWishlist?.(product.id) ? "text-[#C5A059] group-hover/btn:text-[#C5A059]" : ""} />
                         </button>
                         <button onClick={() => setQuickViewProduct(product)} className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-colors">
                            <Eye size={16} />
                         </button>
                      </div>

                      <Link to={`/product/${product.id}`} className="block h-full">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover/card:scale-105 mix-blend-multiply p-4" 
                          loading="lazy" 
                          decoding="async" 
                        />
                      </Link>

                      {product.sale && (
                        <span className="absolute top-4 left-4 bg-black text-white text-[8px] md:text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] shadow-lg">Sale</span>
                      )}
                    </div>

                    {/* Premium Details Container */}
                    <div className="text-center flex flex-col flex-1 px-4 pb-6">
                        <p className="text-[8px] md:text-[9px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-2">{product.category || product.concern || "ALDAY"}</p>
                        
                        <Link to={`/product/${product.id}`} className="block group-hover/card:text-[#C5A059] transition-colors mb-3">
                            <h6 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[40px] tracking-tight">{product.name}</h6>
                        </Link>
                        
                        <div className="flex justify-center items-center gap-3 mb-6 mt-auto">
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-gray-400 text-[10px] md:text-xs line-through font-light">₹{product.mrp}</span>
                            )}
                            <span className="text-base md:text-lg font-black text-gray-900">₹{product.price}</span>
                        </div>
                        
                        <button 
                           onClick={() => handleAddToCart(product)} 
                           className="w-full bg-white border border-gray-200 text-gray-900 py-3.5 md:py-4 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em] group-hover/card:bg-black group-hover/card:text-white group-hover/card:border-black transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={14} /> Add To Bag
                        </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-sm border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                    <Filter size={24} className="text-gray-400" />
                  </div>
                  <h5 className="font-serif font-bold text-xl md:text-2xl mb-2 text-gray-900">No results found</h5>
                  <p className="text-sm text-gray-500 mb-8 max-w-md text-center">We couldn't find any clinical formulations matching your current filters. Try adjusting your search.</p>
                  <button onClick={resetFilters} className="bg-black text-white px-10 py-3.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors shadow-lg">Clear All Filters</button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-20 gap-3 border-t border-gray-200 pt-10">
                 {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => {setCurrentPage(i + 1); window.scrollTo({top: 300, behavior: 'smooth'});}} 
                      className={`w-10 h-10 rounded-sm border text-xs font-bold transition-all duration-300 ${currentPage === i + 1 ? 'bg-black text-white border-black shadow-lg' : 'border-gray-200 text-gray-500 bg-white hover:border-black hover:text-black'}`}
                    >
                      {i + 1}
                    </button>
                 ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setQuickViewProduct(null)}>
           <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden rounded-sm shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-all" onClick={() => setQuickViewProduct(null)}>
                 <X size={20} />
              </button>
              
              <div className="w-full md:w-1/2 bg-[#F4F4F4] flex items-center justify-center p-8">
                 <img src={quickViewProduct.image} alt={quickViewProduct.name} className="max-w-full max-h-[400px] object-contain mix-blend-multiply transition-transform duration-1000 hover:scale-105" />
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-14 overflow-y-auto flex flex-col justify-center">
                 <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-4 block">{quickViewProduct.category || "Hair Care"}</span>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight">{quickViewProduct.name}</h2>
                 <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed font-light">{quickViewProduct.description || "Experience the potency of clinical nutrition formulations for your daily care routine."}</p>
                 
                 <div className="flex items-center gap-5 mb-10 border-y border-gray-100 py-6">
                    <span className="text-3xl font-black text-gray-900">₹{quickViewProduct.price}</span>
                    {quickViewProduct.mrp && <span className="text-gray-400 line-through text-lg">₹{quickViewProduct.mrp}</span>}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <button onClick={() => handleAddToCart(quickViewProduct)} className="flex-1 bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all shadow-lg rounded-sm flex items-center justify-center gap-2"><ShoppingBag size={16}/> Add To Bag</button>
                    <button onClick={() => navigate(`/product/${quickViewProduct.id}`)} className="flex-1 border border-gray-200 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2 rounded-sm">Full Details <ArrowRight size={16}/></button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;