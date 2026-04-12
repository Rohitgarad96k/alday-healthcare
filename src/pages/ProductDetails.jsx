import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Star, Minus, Plus, ShoppingBag, ChevronDown,
  ShieldCheck, Leaf, Droplet, CheckCircle, Heart, Share2,
  MapPin, X, Check
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
//  1. Import global context
import { useProducts } from '../context/ProductContext';

import API from '../api/axiosInstance';

// Safety wrapper for corrupted text arrays
const safeText = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (Array.isArray(value)) {
    if (typeof value[0] === 'object') return fallback;
    return value.join(', ');
  }
  return fallback;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  //  2. Grab products instantly from memory
  const { products, isLoading } = useProducts();

  //  3. Derive current product and related items without fetching
  const product = products.find(p => p._id === id || p.productId === id || String(p.id) === String(id));
  const relatedProducts = products.filter(p => p._id !== id && p.productId !== id).slice(0, 4);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('desc');
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [upsellSelected, setUpsellSelected] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [toastMsg, setToastMsg] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reset UI when navigating between different products
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveImg(0);
    setQty(1);
    setUpsellSelected(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-[#FCFCFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059] mb-4"></div>
        <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Loading Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Product Not Found</h2>
        <Link to="/view-all" className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm">Return to Shop</Link>
      </div>
    );
  }

  const isOutOfStock = !product.countInStock || product.countInStock <= 0;
  const upsellProduct = relatedProducts.length > 0 ? relatedProducts[0] : null;
  const shippingThreshold = 999;
  const mainTotal = (product.price || 0) * qty;
  const upsellTotal = (upsellSelected && upsellProduct) ? (upsellProduct.price || 0) : 0;
  const finalTotal = mainTotal + upsellTotal;
  const progress = Math.min((finalTotal / shippingThreshold) * 100, 100);
  const productId = product._id || product.id;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const checkPincode = () => {
    if (pincode.length === 6) setDeliveryMsg("Delivery available! Est: 3-5 Days");
    else setDeliveryMsg("Please enter a valid 6-digit pincode");
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${product.images && product.images.length > 0 ? product.images[activeImg] : (product.image || product.imageUrl)})`
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, qty);
    if (upsellSelected && upsellProduct) {
      addToCart(upsellProduct, 1);
    }
    showToast(`Added to Cart successfully!`);
    setIsCartOpen(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(isInWishlist(productId) ? "Removed from Wishlist" : "Added to Wishlist");
  };

  const handleWriteReviewClick = () => {
    if (user) {
      setShowReviewModal(true);
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmittingReview(true);
    try {
      await API.post(`/product/${productId}/review`, {
        rating,
        title: reviewTitle,
        comment: reviewComment
      });

      setShowReviewModal(false);
      showToast("Review submitted successfully!");

      if (!product.reviews) product.reviews = [];
      product.reviews.unshift({
        name: user.fullName || user.name,
        rating,
        title: reviewTitle,
        comment: reviewComment,
        createdAt: new Date().toISOString()
      });

      setReviewTitle('');
      setReviewComment('');
      setRating(5);
    } catch (error) {
      console.error("Review submission failed:", error);
      alert(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image || product.imageUrl || "https://via.placeholder.com/600"];
  const reviewsList = product.reviews || [];

  return (
    <div className="bg-white font-sans text-gray-900 pb-20 md:pb-0 relative">

      <style>{`
        .App, main, body, html {
          overflow-x: clip !important; 
        }
      `}</style>

      {toastMsg && (
        <div className="fixed top-24 right-6 bg-black text-white px-6 py-3 rounded-sm shadow-xl z-[200] animate-fade-in-up flex items-center gap-3">
          <Check size={16} className="text-green-400" />
          <span className="text-sm font-bold uppercase tracking-wide">{toastMsg}</span>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white w-full max-w-lg p-8 rounded-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-serif font-bold mb-2">Write a Review</h3>
            <p className="text-sm text-gray-500 mb-6">Share your experience with {safeText(product.name, "this product")}</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-700 block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={28}
                      fill={i <= rating ? "currentColor" : "none"}
                      className={`cursor-pointer transition-colors ${i <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                      onClick={() => setRating(i)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-700 block mb-2">Review Title</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full border border-gray-300 p-3 text-sm rounded-sm focus:border-black outline-none"
                  placeholder="E.g. Visibly transformed my routine!"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-700 block mb-2">Your Experience</label>
                <textarea
                  required
                  rows="4"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border border-gray-300 p-3 text-sm rounded-sm focus:border-black outline-none"
                  placeholder="Tell us how you used it and what results you saw..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className={`w-full text-white font-bold uppercase tracking-widest text-xs py-4 transition-colors rounded-sm mt-4 ${isSubmittingReview ? 'bg-gray-400' : 'bg-black hover:bg-[#C5A059]'}`}
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showVideo && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 text-white z-10 hover:text-gray-300 transition-colors bg-black/50 p-2 rounded-full"><X size={24} /></button>
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" title="Product Video" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:mt-6">

        {/* BREADCRUMBS */}
        <div className="text-[10px] md:text-xs text-gray-500 mb-6 uppercase tracking-widest flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-black transition-colors">Home</Link> /
          <Link to={`/view-all?cat=${safeText(product.category) || safeText(product.concern)}`} className="hover:text-black cursor-pointer transition-colors">
            {safeText(product.category, safeText(product.concern, "Shop"))}
          </Link> /
          <span className="text-black font-bold border-b border-black pb-0.5">{safeText(product.name)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          <div className="lg:sticky lg:top-24 z-10">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col m-4 gap-3 overflow-x-auto md:overflow-visible w-full md:w-20 flex-shrink-0 hide-scrollbar py-1">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 md:w-20 md:h-20 border rounded-sm overflow-hidden flex-shrink-0 transition-all duration-300 ${activeImg === i ? 'border-black ring-1 ring-black opacity-100 scale-95' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>

              <div
                className="flex-1 bg-[#F9F9F9] rounded-sm relative group aspect-[4/5] md:h-[550px] flex items-center justify-center overflow-hidden cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomStyle({ display: 'none' })}
              >
                <img
                  src={displayImages[activeImg]}
                  alt={safeText(product.name)}
                  className="max-h-full max-w-full object-contain mix-blend-multiply p-8 transition-opacity duration-300"
                  loading="eager"
                />

                <div className="absolute inset-0 pointer-events-none bg-no-repeat bg-[length:200%] z-20 transition-opacity duration-200" style={{ ...zoomStyle, opacity: zoomStyle.display === 'block' ? 1 : 0 }} />

                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.sale && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm shadow-sm">Sale</span>
                  )}
                  {isOutOfStock && (
                    <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm shadow-sm">Sold Out</span>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
                  <button onClick={handleToggleWishlist} className="bg-white p-2.5 rounded-full shadow-sm hover:shadow-lg hover:bg-black hover:text-white transition-all duration-300 group/btn">
                    <Heart size={20} fill={isInWishlist(productId) ? "#EF4444" : "none"} className={isInWishlist(productId) ? "text-red-500 group-hover/btn:text-red-500" : ""} />
                  </button>
                  <button className="bg-white p-2.5 rounded-full shadow-sm hover:shadow-lg hover:bg-black hover:text-white transition-all duration-300">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= (product.rating || 5) ? "currentColor" : "none"} />)}
                </div>
                <span className="text-xs font-bold text-gray-500 underline cursor-pointer hover:text-black transition-colors">{product.reviewCount || reviewsList.length || 0} Reviews</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-gray-900 mb-3 leading-tight">
                {safeText(product.title) || safeText(product.name)}
              </h1>
              <p className="text-base md:text-lg text-gray-500 font-light leading-relaxed">{safeText(product.subtitle) || safeText(product.description) || "Zero Dilution Clinical Formulation"}</p>
            </div>

            {!isOutOfStock && (
              <div className="text-red-600 text-xs font-bold animate-pulse flex items-center gap-2 bg-red-50 w-fit px-3 py-1.5 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>
                Only a few units left at this price!
              </div>
            )}

            <div className="border-y border-gray-100 py-6 my-2">
              <div className="flex items-end gap-4 mb-5">
                <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through mb-1">₹{product.mrp}</span>
                    <span className="text-green-700 text-xs font-black bg-green-50 px-2 py-1 mb-1.5 rounded-sm uppercase tracking-wider">
                      Save {(100 - (product.price / product.mrp) * 100).toFixed(0)}%
                    </span>
                  </>
                )}
              </div>

              <div className="bg-[#FBFBFB] p-5 rounded-sm mb-6 border border-gray-200">
                <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase mb-3 tracking-widest">
                  <span className="text-gray-600">{progress < 100 ? `Add ₹${(shippingThreshold - finalTotal).toFixed(2)} for Free Shipping` : "Free Shipping Unlocked!"}</span>
                  <span className="text-[#C5A059]">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Delivery Pincode"
                    maxLength="6"
                    className="w-full border border-gray-300 rounded-sm py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-black transition-colors bg-[#FBFBFB] focus:bg-white"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <button onClick={checkPincode} className="text-xs font-bold bg-black text-white px-8 rounded-sm hover:bg-[#C5A059] transition-colors uppercase tracking-widest shadow-sm">CHECK</button>
              </div>
              {deliveryMsg && (
                <p className={`text-xs font-bold flex items-center gap-1.5 ${deliveryMsg.includes('available') ? 'text-green-600' : 'text-red-600'}`}>
                  {deliveryMsg.includes('available') ? <Check size={14} /> : <X size={14} />}
                  {deliveryMsg}
                </p>
              )}

              {upsellProduct && !isOutOfStock && (
                <div className={`mt-8 border p-4 rounded-sm transition-all duration-300 cursor-pointer ${upsellSelected ? 'border-black bg-gray-50/50' : 'border-gray-200 bg-white hover:border-gray-300'}`} onClick={() => setUpsellSelected(!upsellSelected)}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Frequently Bought Together</h4>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black pointer-events-none"
                      checked={upsellSelected}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#F9F9F9] border border-gray-100 rounded-sm p-1 flex-shrink-0">
                      <img src={upsellProduct.image || upsellProduct.imageUrl || "https://via.placeholder.com/300"} className="w-full h-full object-contain mix-blend-multiply" alt={safeText(upsellProduct.name)} loading="lazy" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold line-clamp-1 text-gray-900">{safeText(upsellProduct.name)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black">₹{upsellProduct.price}</span>
                        {upsellProduct.mrp > upsellProduct.price && <span className="line-through text-xs text-gray-400 font-light">₹{upsellProduct.mrp}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className={`flex items-center border border-gray-300 rounded-sm w-full sm:w-36 justify-between px-4 h-14 bg-[#FBFBFB] ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={isOutOfStock} className="text-gray-500 hover:text-black transition-colors p-1"><Minus size={16} /></button>
                  <span className="font-bold text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} disabled={isOutOfStock} className="text-gray-500 hover:text-black transition-colors p-1"><Plus size={16} /></button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full sm:flex-1 h-[56px] text-white font-bold uppercase tracking-[0.15em] transition-all duration-300 flex justify-center items-center gap-3 text-xs md:text-sm rounded-sm active:scale-[0.98] ${isOutOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-black hover:bg-[#C5A059] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgba(197,160,89,0.3)]'
                    }`}
                >
                  {isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <>
                      <ShoppingBag size={18} className="mb-0.5" />
                      <span>Add To Bag</span>
                      <span className="opacity-40 font-normal mx-1">|</span>
                      <span>₹{finalTotal}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <FeatureIcon icon={<ShieldCheck size={22} />} label="100% Natural" />
              <FeatureIcon icon={<Leaf size={22} />} label="Vegan Formula" />
              <FeatureIcon icon={<Droplet size={22} />} label="Zero Dilution" />
            </div>

            <div className="border-t border-gray-200 mt-2">
              <Accordion title="Description" isOpen={openAccordion === 'desc'} onClick={() => setOpenAccordion(openAccordion === 'desc' ? '' : 'desc')}>
                <p className="text-sm text-gray-600 leading-relaxed pb-5 font-light">
                  {safeText(product.description, "Formulated with clinical precision.")}
                </p>
              </Accordion>
              <Accordion title="How to Use" isOpen={openAccordion === 'use'} onClick={() => setOpenAccordion(openAccordion === 'use' ? '' : 'use')}>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 pb-5 font-light marker:text-[#C5A059]">
                  {product.ritual && product.ritual.length > 0 ? (
                    product.ritual.map((step, idx) => (
                      <li key={idx}><strong>{safeText(step.title)}:</strong> {safeText(step.desc)}</li>
                    ))
                  ) : (
                    <>
                      <li>Apply directly to the target area on clean skin/hair.</li>
                      <li>Massage gently for 3-5 minutes until fully absorbed into the dermis.</li>
                      <li>Leave overnight for optimal clinical results. Use daily.</li>
                    </>
                  )}
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-serif font-bold tracking-tight mb-12 md:mb-16 text-center text-gray-900">Real Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:sticky md:top-24 z-10">
              <div className="bg-[#F9F9F9] p-8 md:p-10 text-center rounded-sm border border-gray-100 transition-all duration-300">
                <div className="text-6xl md:text-7xl font-black text-gray-900 mb-3">{product.rating || "4.8"}</div>
                <div className="flex justify-center text-yellow-500 mb-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={20} />)}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">Based on {product.reviewCount || reviewsList.length || 0} Reviews</p>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {[5, 4, 3, 2, 1].map(star => (
                    <button key={star} className="text-xs border border-gray-300 px-4 py-2 rounded-full hover:border-black hover:bg-black hover:text-white transition-all font-bold">
                      {star} ★
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleWriteReviewClick}
                  className="w-full border border-black text-black py-4 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-colors rounded-sm"
                >
                  {user ? "Write a Review" : "Login to Review"}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              {reviewsList.length > 0 ? (
                reviewsList.map((review, idx) => (
                  <div key={idx} className="border border-gray-100 p-6 md:p-8 rounded-sm hover:border-gray-200 transition-colors bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} fill={i <= review.rating ? "currentColor" : "none"} size={14} />)}
                      </div>
                      <span className="text-[9px] text-green-700 bg-green-50 px-2 py-1 font-bold uppercase tracking-widest rounded-sm flex items-center gap-1">
                        <CheckCircle size={10} /> Verified
                      </span>
                    </div>
                    <h4 className="font-bold text-base md:text-lg text-gray-900 mb-2">{safeText(review.title)}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-5 font-light">
                      "{safeText(review.comment)}"
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{safeText(review.name || review.user?.name, "Customer")}</span>
                      {review.createdAt && (
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="border border-dashed border-gray-200 p-12 text-center rounded-sm flex flex-col items-center justify-center h-full">
                  <Star size={40} className="text-gray-200 mb-4" />
                  <h4 className="font-bold text-lg text-gray-900 mb-2">No reviews yet</h4>
                  <p className="text-sm text-gray-500 font-light max-w-sm mx-auto">Have you tried this clinical formulation? Be the first to share your experience with the community.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-20 md:py-24 bg-[#F8F9FA] border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mb-3 block">Complete The Regimen</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">You May Also Like</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((item) => (
                <Link to={`/product/${item._id || item.id}`} key={item._id || item.id} className="bg-white flex flex-col rounded-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 group">
                  <div className="aspect-[4/5] bg-[#F9F9F9] overflow-hidden relative rounded-t-sm">
                    <img
                      src={item.image || item.imageUrl || "https://via.placeholder.com/300"}
                      alt={safeText(item.name)}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply p-2"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 md:p-5 text-center flex-1 flex flex-col">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1.5">
                      {safeText(item.category, "ALDAY")}
                    </p>
                    <h3 className="font-bold text-xs md:text-sm mb-3 line-clamp-2 group-hover:text-[#C5A059] transition-colors leading-snug">
                      {safeText(item.name, "Clinical Formulation")}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-auto">
                      <span className="font-black text-sm text-gray-900">₹{item.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 flex items-center gap-4 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex-1">
          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] truncate mb-0.5">{safeText(product.name)}</p>
          <p className="text-lg font-black leading-none text-gray-900">₹{finalTotal}</p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`text-white px-8 py-3.5 font-bold uppercase tracking-widest text-[10px] rounded-sm shadow-md transition-transform flex items-center gap-2 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-black active:scale-95'}`}
        >
          <ShoppingBag size={14} /> {isOutOfStock ? 'Sold Out' : 'Add'}
        </button>
      </div>

    </div>
  );
};

const FeatureIcon = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center gap-3 p-5 border border-gray-100 rounded-sm bg-[#FBFBFB] hover:bg-white transition-colors hover:shadow-sm">
    <span className="text-[#C5A059]">{icon}</span>
    <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-600 text-center leading-tight">{label}</span>
  </div>
);

const Accordion = ({ title, isOpen, onClick, children }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button onClick={onClick} className="w-full flex justify-between items-center py-5 text-left group">
      <span className="font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] text-gray-900 group-hover:text-[#C5A059] transition-colors">{title}</span>
      <div className={`text-gray-400 group-hover:text-[#C5A059] transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'rotate-180' : ''}`}>
        <ChevronDown size={16} />
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
      {children}
    </div>
  </div>
);

export default ProductDetails;