import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

// --- GLOBAL UI COMPONENTS ---
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import BackToTop from './components/BackToTopButton';

// --- INSTANT LOAD PAGES (Fixes the click lag) ---
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetails from './pages/ProductDetails';
import { AnimatePresence, MotionConfig } from 'framer-motion';

// --- LAZY LOADED PAGES (Only for secondary pages) ---
const DermaAnalyser = lazy(() => import('./pages/DermaAnalyser'));
const FoundersCorner = lazy(() => import('./pages/FoundersCorner'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));

// Loading Screen Component
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);
// Create a wrapper component for the page transitions
const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            
            {/* ScrollToTop component handles instant scrolling */}
            <ScrollToTop />

            {/* Added overflow-x-hidden HERE instead of index.css */}
            <div className="App relative font-sans text-gray-900 bg-white flex flex-col min-h-screen overflow-x-hidden">
              
              <Navbar />
              <CartDrawer />

              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                <PageWrapper>
                  <Routes>
                    {/* CORE PAGES - Instant Load */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/view-all" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    
                    {/* SECONDARY PAGES - Lazy Load */}
                    <Route path="/derma-analyser" element={<DermaAnalyser />} />
                    <Route path="/founders-corner" element={<FoundersCorner />} />
                    <Route path="/our-story" element={<OurStory />} />
                    
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<Success />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/help-support" element={<HelpSupport />} />
                  </Routes>
                  </PageWrapper>
                </Suspense>
              </main>

              <Footer />
              <BackToTop />

            </div>

          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;