import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, User, Menu, Heart, X, ChevronRight, TrendingUp, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Context Hooks
  const { setIsCartOpen, getCartCount } = useCart();
  const { user } = useAuth();
  const { getWishlistCount } = useWishlist();

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
    setExpandedMobileMenu(null);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu OR search is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen, isSearchOpen]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/view-all?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      searchQuery("");
    }
  };

  const handleTrendingClick = (term) => {
    navigate(`/view-all?search=${encodeURIComponent(term)}`);
    setIsSearchOpen(false);
  };

  const toggleMobileAccordion = (menuName) => {
    setExpandedMobileMenu(expandedMobileMenu === menuName ? null : menuName);
  };

  // Data for the Full-Width Mega Menus
  const megaMenuData = {
    'HAIRCARE': {
      products: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum', 'Hair Perfume'],
      concerns: ['Hair Growth', 'Hair Fall', 'Dandruff', 'Dry/Damaged Hair', 'Hair Loss'],
      ingredients: ['Rosemary', 'Onion', 'Coconut', 'Argan', 'Tea Tree', 'Castor'],
      image: 'data:image/jpeg;base64,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'
    },
    'SKINCARE': {
      products: ['Face Wash', 'Face Toner', 'Face Serum', 'Moisturiser', 'Sunscreen'],
      concerns: ['Pigmentation', 'Acne', 'Ageing', 'Sun Protection', 'Sensitivity'],
      ingredients: ['Vitamin C', 'Salicylic Acid', 'Hyaluronic Acid', 'Neem', 'Rose'],
      image: 'data:image/jpeg;base64,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'
    },
    'BODYCARE': {
      products: ['Body Wash', 'Body Scrub', 'Body Lotion', 'Body Oil', 'Soaps'],
      concerns: ['Body Acne', 'Dryness', 'Tanning', 'Stretch Marks'],
      ingredients: ['Coffee', 'Almond', 'Shea Butter', 'Cocoa', 'Lavender'],
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80'
    }
  };

  const exploreMenuData = [
    { label: "DERMA ANALYSER", link: "/derma-analyser", badge: true },
    { label: "FOUNDERS CORNER", link: "/founders-corner" },
    { label: "OUR STORY", link: "/our-story" }
  ];

  const menuItems = ['HAIRCARE', 'SKINCARE', 'BODYCARE', 'GIFTING', 'RITUALS', 'EXPLORE'];
  const trendingSearches = ['Rosemary Hair Oil', 'Vitamin C Serum', 'Anti-Dandruff', 'Sunscreen SPF 50'];

  return (
    <>
      <div className="sticky top-0 z-50 bg-white group">

        {/* NOTIFICATION BAR */}
        <div className="bg-[#F8F8F8] text-[#1A1A1A] text-[10px] md:text-xs font-bold tracking-[0.15em] text-center py-2.5 border-b border-gray-100 relative z-50">
          100% NATURAL NUTRITION &nbsp;|&nbsp; NO CHEMICALS &nbsp;|&nbsp; NO PRESERVATIVES
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="bg-white border-b border-gray-100 relative z-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-50 text-decoration-none flex-shrink-0" onClick={() => setIsSearchOpen(false)}>
              <span className="text-xl md:text-2xl font-bold tracking-widest text-black">
                ALDAY<span className="font-light">HEALTH</span>
              </span>
              <div className="hidden md:flex w-7 h-7 rounded-full border border-black items-center justify-center font-serif font-bold text-sm text-black">
                A
              </div>
            </Link>

            {/* Desktop Links (Center) */}
            <div className="hidden lg:flex items-center h-full">
              <div className="h-full flex items-center px-5 group/item cursor-pointer">
                <Link to="/view-all" className="text-xs font-bold text-gray-800 uppercase tracking-[0.15em] group-hover/item:text-[#C5A059] transition-colors relative">
                  SHOP ALL
                  <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#C5A059] transition-all duration-300 group-hover/item:w-full"></span>
                </Link>
              </div>

              {menuItems.map((item) => (
                <div
                  key={item}
                  className="h-full flex items-center px-5 group/item cursor-pointer relative"
                  onMouseEnter={() => !isSearchOpen && setActiveMenu(item)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link to={item === 'EXPLORE' ? '#' : `/view-all?cat=${item}`} className="text-xs font-bold text-gray-800 uppercase tracking-[0.15em] group-hover/item:text-[#C5A059] transition-colors relative">
                    {item}
                    <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#C5A059] transition-all duration-300 group-hover/item:w-full"></span>
                  </Link>

                  {/* MEGA MENU DROPDOWN */}
                  {activeMenu === item && megaMenuData[item] && !isSearchOpen && (
                    <div className="fixed top-[115px] left-0 w-full bg-white shadow-xl border-t border-gray-100 py-12 animate-fade-in cursor-default" style={{ zIndex: 60 }}>
                      <div className="max-w-[1200px] mx-auto px-6 flex justify-between">
                        <div className="w-1/4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Products</h4>
                          <ul className="space-y-3">
                            {megaMenuData[item].products.map((link) => (
                              <li key={link}>
                                <Link to={`/view-all?search=${link}`} onClick={() => setActiveMenu(null)} className="text-sm text-gray-800 hover:text-[#C5A059] transition-colors font-medium block">{link}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="w-1/4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Concerns</h4>
                          <ul className="space-y-3">
                            {megaMenuData[item].concerns.map((link) => (
                              <li key={link}>
                                <Link to={`/view-all?cat=${link}`} className="text-sm text-gray-800 hover:text-[#C5A059] transition-colors font-medium block">{link}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="w-1/4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Ingredients</h4>
                          <ul className="space-y-3">
                            {megaMenuData[item].ingredients.map((link) => (
                              <li key={link}>
                                <Link to={`/view-all?search=${link}`} className="text-sm text-gray-800 hover:text-[#C5A059] transition-colors font-medium block">{link}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="w-1/4 pl-10 border-l border-gray-100">
                          <Link to={`/view-all?cat=${item}`}>
                            <div className="w-full h-64 overflow-hidden relative group/img cursor-pointer">
                              <img src={megaMenuData[item].image} alt={item} className="w-full h-full object-cover mix-blend-multiply group-hover/img:scale-105 transition-transform duration-700" />
                              <div className="absolute bottom-4 left-4">
                                <span className="bg-black text-white text-[10px] uppercase font-bold px-3 py-1">Bestseller</span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EXPLORE DROPDOWN */}
                  {activeMenu === 'EXPLORE' && item === 'EXPLORE' && !isSearchOpen && (
                    <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-lg border border-gray-100 py-4 animate-fade-in z-50">
                      <div className="flex flex-col">
                        {exploreMenuData.map((exploreItem, idx) => (
                          <Link key={idx} to={exploreItem.link} className="px-6 py-3 text-sm text-gray-800 hover:bg-gray-50 hover:text-[#C5A059] font-medium tracking-wide uppercase relative">
                            {exploreItem.label}
                            {exploreItem.badge && (
                              <span className="absolute top-3.5 left-[135px] w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Icons (Right Side) */}
            <div className="flex items-center space-x-4 md:space-x-6 text-gray-800 z-50">

              {/* SEARCH TOGGLE ICON */}
              <div className="relative flex items-center">
                {isSearchOpen ? (
                  <X
                    strokeWidth={1.5}
                    className="w-5 h-5 cursor-pointer text-black transition-transform hover:rotate-90"
                    onClick={() => setIsSearchOpen(false)}
                  />
                ) : (
                  <Search
                    strokeWidth={1.5}
                    className="w-5 h-5 cursor-pointer hover:text-[#C5A059] transition-colors"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setActiveMenu(null);
                    }}
                  />
                )}
              </div>

              {/* WISHLIST ICON */}
              <Link to="/wishlist" className="relative group block">
                <Heart strokeWidth={1.5} className="w-5 h-5 cursor-pointer hover:text-[#C5A059] transition-colors" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {/* USER ICON */}
              <Link to={user ? "/account" : "/login"} className="relative group hidden sm:block">
                <User strokeWidth={1.5} className="w-5 h-5 cursor-pointer hover:text-[#C5A059] transition-colors" />
                {user && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                )}
              </Link>

              {/* SHOPPING BAG ICON */}
              <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag strokeWidth={1.5} className="w-5 h-5 group-hover:text-[#C5A059] transition-colors" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </div>

              {/* MOBILE HAMBURGER MENU ICON */}
              <button
                className="lg:hidden cursor-pointer hover:text-[#C5A059] transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(true);
                  setIsSearchOpen(false);
                }}
              >
                <Menu strokeWidth={1.5} className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* --- PREMIUM SEARCH DROPDOWN PANEL --- */}
          <div
            className={`absolute top-full left-0 w-full bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top z-40 border-t border-gray-100 ${isSearchOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none absolute -z-10'
              }`}
          >
            <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <div className="flex items-center w-full border border-gray-200 rounded-lg px-4 py-3 md:py-4 bg-[#FBFBFB] focus-within:bg-white focus-within:border-[#C5A059] focus-within:shadow-[0_0_0_4px_rgba(197,160,89,0.1)] transition-all duration-300">
                  <Search size={22} className="text-gray-400 mr-3 shrink-0" strokeWidth={2} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products, ingredients, or concerns..."
                    className="flex-1 outline-none text-gray-800 bg-transparent text-base md:text-lg w-full placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <div
                      className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full cursor-pointer transition-colors shrink-0 ml-2"
                      onClick={() => { setSearchQuery(""); searchInputRef.current.focus(); }}
                    >
                      <X size={14} className="text-gray-500" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </form>

              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-[#C5A059]" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {trendingSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(term)}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs md:text-sm rounded-full hover:border-black hover:text-black transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </nav>

        {/* Desktop Mega Menu Overlay */}
        {activeMenu && megaMenuData[activeMenu] && !isSearchOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[2px] transition-opacity duration-500 animate-fade-in hidden lg:block"
            style={{ top: '115px' }}
            onMouseEnter={() => setActiveMenu(null)}
          />
        )}
      </div>

      {/* --- DIMMED BACKGROUND OVERLAY FOR SEARCH --- */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-400 lg:top-[115px] top-[90px] ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsSearchOpen(false)}
      />

      {/* =========================================================
          MOBILE MENU DRAWER (RESPONSIVE)
      ========================================================= */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
        
        <div 
          className={`absolute top-0 right-0 h-full w-[85%] sm:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#FBFBFB]">
            <span className="text-xl font-bold tracking-widest text-black">
              ALDAY
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200">
              <X size={24} className="text-gray-500 hover:text-black" />
            </button>
          </div>

          {/* Mobile Menu Scrollable Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
            
            <Link 
              to="/view-all" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 px-3 -mx-3 rounded-lg border-b border-gray-100 text-sm font-bold uppercase tracking-widest active:bg-gray-100 active:text-[#C5A059] transition-colors"
            >
              Shop All
            </Link>

            {/* Accordion Categories */}
            {['HAIRCARE', 'SKINCARE', 'BODYCARE'].map((cat) => (
              <div key={cat} className="border-b border-gray-100">
                
                {/* SPLIT INTERACTION: Word navigates & closes, Arrow expands list */}
                <div className="w-full flex items-center justify-between px-3 -mx-3 rounded-lg group active:bg-gray-100 transition-colors">
                  <Link 
                    to={`/view-all?cat=${cat}`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest text-gray-900 transition-colors ${expandedMobileMenu === cat ? 'text-[#C5A059]' : ''}`}
                  >
                    {cat}
                  </Link>
                  <button 
                    onClick={() => toggleMobileAccordion(cat)}
                    className="p-3 -mr-3"
                    aria-label={`Toggle ${cat} submenu`}
                  >
                    <ChevronDown size={18} className={`transition-transform duration-300 text-gray-400 ${expandedMobileMenu === cat ? 'rotate-180 text-[#C5A059]' : ''}`} />
                  </button>
                </div>
                
                {/* Dropdown Content */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedMobileMenu === cat ? 'max-h-[1000px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-4 border-l-2 border-gray-100 space-y-6 mt-2">
                    
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shop by Category</p>
                      <ul className="space-y-1">
                        {megaMenuData[cat].products.map((item) => (
                          <li key={item}>
                            <Link 
                              to={`/view-all?search=${item}`} 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 px-3 -mx-3 rounded-lg text-sm text-gray-600 active:bg-gray-100 active:text-black transition-colors"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shop by Concern</p>
                      <ul className="space-y-1">
                        {megaMenuData[cat].concerns.map((item) => (
                          <li key={item}>
                            <Link 
                              to={`/view-all?cat=${item}`} 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 px-3 -mx-3 rounded-lg text-sm text-gray-600 active:bg-gray-100 active:text-black transition-colors"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 🔥 ADDED: Shop by Ingredients section */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shop by Ingredients</p>
                      <ul className="space-y-1">
                        {megaMenuData[cat].ingredients.map((item) => (
                          <li key={item}>
                            <Link 
                              to={`/view-all?search=${item}`} 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 px-3 -mx-3 rounded-lg text-sm text-gray-600 active:bg-gray-100 active:text-black transition-colors"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            <Link 
              to="/view-all?cat=Gifting" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 px-3 -mx-3 rounded-lg border-b border-gray-100 text-sm font-bold uppercase tracking-widest active:bg-gray-100 active:text-[#C5A059] transition-colors"
            >
              Gifting
            </Link>
            
            <Link 
              to="/view-all?cat=Rituals" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 px-3 -mx-3 rounded-lg border-b border-gray-100 text-sm font-bold uppercase tracking-widest active:bg-gray-100 active:text-[#C5A059] transition-colors"
            >
              Rituals
            </Link>

            {/* Explore Section */}
            <div className="mt-8">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">Explore Alday</p>
               <div className="space-y-1">
                  {exploreMenuData.map((item, idx) => (
                    <Link 
                      key={idx} 
                      to={item.link} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center py-3 px-3 -mx-3 rounded-lg text-sm font-medium text-gray-800 active:bg-gray-100 active:text-[#C5A059] transition-colors"
                    >
                      {item.label}
                      {item.badge && <span className="ml-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>}
                    </Link>
                  ))}
               </div>
            </div>

          </div>

          {/* Mobile Menu Footer Actions */}
          <div className="p-6 bg-[#FBFBFB] border-t border-gray-100 space-y-4">
             <Link 
               to={user ? "/account" : "/login"} 
               onClick={() => setIsMobileMenuOpen(false)}
               className="flex items-center gap-3 p-3 -mx-3 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-900 active:bg-gray-200 transition-colors"
             >
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                 <User size={18} />
               </div>
               {user ? 'My Account' : 'Login / Register'}
             </Link>
             
             <Link 
               to="/wishlist" 
               onClick={() => setIsMobileMenuOpen(false)}
               className="flex items-center gap-3 p-3 -mx-3 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-900 active:bg-gray-200 transition-colors"
             >
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 relative">
                 <Heart size={18} />
                 {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {getWishlistCount()}
                  </span>
                 )}
               </div>
               My Wishlist
             </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;