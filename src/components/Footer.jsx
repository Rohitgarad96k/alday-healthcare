import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Top Section: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-20">

          {/* Brand Info */}
          <div className="lg:w-1/3">
            <Link to="/" className="text-3xl font-bold tracking-widest block mb-6 uppercase">
              ALDAY<span className="font-light">HEALTH</span>
              <span className="text-[#C5A059] ml-1">.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              100% Natural, Clinical Nutrition for your Hair & Skin.
              Formulated with Zero Dilution technology for maximum efficacy.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={18} />} link="https://instagram.com/aldayhealth" />
              <SocialIcon icon={<Facebook size={18} />} link="https://facebook.com/aldayhealth" />
              <SocialIcon icon={<Twitter size={18} />} link="https://twitter.com/aldayhealth" />
              <SocialIcon icon={<Youtube size={18} />} link="https://youtube.com/aldayhealth" />
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:w-1/3">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-[#C5A059]">Join The Club</h4>
            <p className="text-gray-400 text-xs mb-6 uppercase tracking-widest">Subscribe for clinical updates and exclusive access.</p>
            <form className="flex border-b border-gray-700 pb-2 group focus-within:border-[#C5A059] transition-colors" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 text-xs font-bold tracking-widest"
              />
              <button className="text-white hover:text-[#C5A059] transition-colors">
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-gray-900 pt-16 mb-16">

          <div>
            <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-white">Shop</h5>
            <ul className="space-y-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              <li><Link to="/view-all?cat=HAIRCARE" className="hover:text-[#C5A059] transition-colors">Hair Care</Link></li>
              <li><Link to="/view-all?cat=SKINCARE" className="hover:text-[#C5A059] transition-colors">Skin Care</Link></li>
              <li><Link to="/view-all?cat=BODYCARE" className="hover:text-[#C5A059] transition-colors">Body Care</Link></li>
              <li><Link to="/view-all" className="hover:text-[#C5A059] transition-colors">Shop All</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-white">Explore</h5>
            <ul className="space-y-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              <li><Link to="/derma-analyser" className="hover:text-[#C5A059] transition-colors">Derma Analyser</Link></li>
              <li><Link to="/our-story" className="hover:text-[#C5A059] transition-colors">Our Story</Link></li>
              <li><Link to="/founders-corner" className="hover:text-[#C5A059] transition-colors">Founders Corner</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-white">Support</h5>
            <ul className="space-y-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              <li><Link to="/track-order" className="hover:text-[#C5A059] transition-colors">Track Order</Link></li>
              <li><Link to="/help-support" className="hover:text-[#C5A059] transition-colors">Help & FAQ</Link></li>
              <li><Link to="/help-support" className="hover:text-[#C5A059] transition-colors">Shipping Info</Link></li>
              <li><Link to="/help-support" className="hover:text-[#C5A059] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-white">Legal</h5>
            <ul className="space-y-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              <li><Link to="/policies#privacy" className="hover:text-[#C5A059] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policies#terms" className="hover:text-[#C5A059] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/policies#refund" className="hover:text-[#C5A059] transition-colors">Cancellation & Refund</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-[0.2em] text-gray-600 pt-8 border-t border-gray-900 uppercase">
          <p>&copy; 2026 Alday Health. Pure Clinical Nutrition.</p>
          <div className="flex items-center gap-6 mt-6 md:mt-0">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <CreditCard size={14} /> Secure SSL Payments
            </span>
            <Link to="/account" className="hover:text-[#C5A059] transition-colors">My Account</Link>
            <Link to="/wishlist" className="hover:text-[#C5A059] transition-colors">Wishlist</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-black transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;