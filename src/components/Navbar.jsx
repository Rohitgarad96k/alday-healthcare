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
      setSearchQuery("");
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
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=400&q=80'
    },
    'SKINCARE': {
      products: ['Face Wash', 'Face Toner', 'Face Serum', 'Moisturiser', 'Sunscreen'],
      concerns: ['Pigmentation', 'Acne', 'Ageing', 'Sun Protection', 'Sensitivity'],
      ingredients: ['Vitamin C', 'Salicylic Acid', 'Hyaluronic Acid', 'Neem', 'Rose'],
      image: 'https://images.unsplash.com/photo-1556228720-191738e4a2e5?auto=format&fit=crop&w=400&q=80'
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
                                <Link to={`/view-all?search=${link}`} className="text-sm text-gray-800 hover:text-[#C5A059] transition-colors font-medium block">{link}</Link>
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
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-500 hover:text-black" />
            </button>
          </div>

          {/* Mobile Menu Scrollable Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
            
            <Link to="/view-all" className="block py-4 border-b border-gray-100 text-sm font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors">
              Shop All
            </Link>

            {/* Accordion Categories */}
            {['HAIRCARE', 'SKINCARE', 'BODYCARE'].map((cat) => (
              <div key={cat} className="border-b border-gray-100">
                <button 
                  onClick={() => toggleMobileAccordion(cat)}
                  className="w-full flex items-center justify-between py-4 text-sm font-bold uppercase tracking-widest text-gray-900 group"
                >
                  <span className={`transition-colors ${expandedMobileMenu === cat ? 'text-[#C5A059]' : 'group-hover:text-[#C5A059]'}`}>{cat}</span>
                  <ChevronDown size={18} className={`transition-transform duration-300 text-gray-400 ${expandedMobileMenu === cat ? 'rotate-180 text-[#C5A059]' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${expandedMobileMenu === cat ? 'max-h-[800px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-4 border-l-2 border-gray-100 space-y-6 mt-2">
                    
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shop by Category</p>
                      <ul className="space-y-3">
                        {megaMenuData[cat].products.map((item) => (
                          <li key={item}>
                            <Link to={`/view-all?search=${item}`} className="text-sm text-gray-600 hover:text-black">{item}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shop by Concern</p>
                      <ul className="space-y-3">
                        {megaMenuData[cat].concerns.map((item) => (
                          <li key={item}>
                            <Link to={`/view-all?cat=${item}`} className="text-sm text-gray-600 hover:text-black">{item}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            <Link to="/view-all?cat=Gifting" className="block py-4 border-b border-gray-100 text-sm font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors">
              Gifting
            </Link>
            <Link to="/view-all?cat=Rituals" className="block py-4 border-b border-gray-100 text-sm font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors">
              Rituals
            </Link>

            {/* Explore Section */}
            <div className="mt-8">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Explore Alday</p>
               <div className="space-y-4">
                  {exploreMenuData.map((item, idx) => (
                    <Link key={idx} to={item.link} className="flex items-center text-sm font-medium text-gray-800 hover:text-[#C5A059]">
                      {item.label}
                      {item.badge && <span className="ml-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>}
                    </Link>
                  ))}
               </div>
            </div>

          </div>

          {/* Mobile Menu Footer Actions */}
          <div className="p-6 bg-[#FBFBFB] border-t border-gray-100 space-y-4">
             <Link to={user ? "/account" : "/login"} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[#C5A059] transition-colors">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                 <User size={18} />
               </div>
               {user ? 'My Account' : 'Login / Register'}
             </Link>
             
             <Link to="/wishlist" className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[#C5A059] transition-colors">
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