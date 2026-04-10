import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, ShieldCheck, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      alt: "Elegant skincare products on minimal background"
    },
    {
      id: 2,
      image: "https://plus.unsplash.com/premium_photo-1661641241213-0b592a6a4c81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFNjYWxwJTIwbWFzc2FnZSUyMGhhaXIlMjBjYXJlJTIwYWVzdGhldGljfGVufDB8fDB8fHww",
      alt: "Natural ingredients and clinical lab setup"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      alt: "Luxurious spa and wellness environment"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[90vh] md:h-[screen] w-full bg-black overflow-hidden">
      
      {/* Background Slideshow */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[10000ms] ease-out"
            style={{
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)'
            }}
          />
          {/* Enhanced Dark Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      ))}

      {/* Main Content (ANIMATED WITH FRAMER MOTION) */}
      <motion.div 
        className="relative z-10 flex flex-col justify-center h-full px-6 md:px-20 lg:px-32 max-w-[1200px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className="mb-6 flex items-center gap-3 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <span className="w-12 h-[1px] bg-[#C5A059]"></span>
          <span className="text-[#C5A059] text-xs font-bold tracking-[0.3em] uppercase">Zero Dilution</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          CLINICAL <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">NUTRITION</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-[500px] font-light leading-relaxed animate-fade-in-up drop-shadow-md" style={{animationDelay: '0.6s'}}>
          Experience the potency of 100% active botanical ingredients. No water, no synthetic fillers. Just pure efficacy for your skin and hair.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <Link 
            to="/view-all" 
            className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Shop The Collection <ArrowRight size={16} />
          </Link>
          <Link 
            to="/derma-analyser" 
            className="border border-white/30 text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm rounded-sm"
          >
            Skin Analyzer
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 md:mt-24 flex items-center gap-8 animate-fade-in-up opacity-80" style={{animationDelay: '1s'}}>
          <div className="flex items-center gap-2 text-white/80">
            <ShieldCheck size={18} className="text-[#C5A059]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Dermatologically Tested</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/80">
            <Beaker size={18} className="text-[#C5A059]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Science Backed</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/80">
            <Leaf size={18} className="text-[#C5A059]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">100% Vegan</span>
          </div>
        </div>
      </motion.div>

      {/* Elegant Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-fade-in opacity-50 hidden md:flex">
        <span className="text-white text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent overflow-hidden">
           <div className="w-full h-1/2 bg-[#C5A059] animate-scroll-down"></div>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-10 right-10 md:right-20 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full border border-white/50 ${
              index === currentSlide 
              ? 'w-10 h-2 bg-white' 
              : 'w-2 h-2 bg-transparent hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;