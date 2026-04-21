import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, ShieldCheck, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1920&q=80",
      alt: "Skincare"
    },
    {
      id: 2,
      image: "https://plus.unsplash.com/premium_photo-1676677514671-23f9d48ab3fa?auto=format&fit=crop&w=1920&q=80",
      alt: "Haircare"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1920&q=80",
      alt: "Wellness"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[75vh] sm:h-[85vh] lg:h-screen w-full overflow-hidden">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="
              w-full h-full object-cover 
              object-[center_top] sm:object-center
              transition-transform duration-[12000ms] ease-out
              scale-100 sm:scale-105 lg:scale-110
            "
          />

          {/* 🔥 PREMIUM LIGHT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
        </div>
      ))}

      {/* Content */}
      <motion.div 
        className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 md:px-16 lg:px-24 max-w-[1100px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Tag */}
        <div className="mb-4 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#C5A059]"></span>
          <span className="text-[#C5A059] text-[10px] tracking-[0.25em] uppercase">
            Zero Dilution
          </span>
        </div>
        
        {/* Heading (FIXED RESPONSIVE) */}
        <h1 className="
          text-3xl 
          sm:text-5xl 
          md:text-6xl 
          lg:text-7xl 
          xl:text-8xl 
          font-serif font-bold text-white leading-[1.1] mb-4
        ">
          CLINICAL <br />
          <span className="text-gray-300">NUTRITION</span>
        </h1>
        
        {/* Description */}
        <p className="
          text-sm 
          sm:text-base 
          md:text-lg 
          text-gray-200 
          mb-6 max-w-[480px]
        ">
          Experience the potency of 100% active botanical ingredients. No water, no synthetic fillers.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/view-all"
            className="bg-white text-black px-6 py-3 text-xs uppercase flex items-center gap-2 hover:bg-[#C5A059] hover:text-white transition"
          >
            Shop <ArrowRight size={16} />
          </Link>

          <Link 
            to="/derma-analyser"
            className="border border-white text-white px-6 py-3 text-xs uppercase hover:bg-white/10"
          >
            Skin Analyzer
          </Link>
        </div>

        {/* Trust */}
        <div className="mt-8 flex flex-wrap gap-4 text-white/80 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            Dermatologically Tested
          </div>
          <div className="flex items-center gap-2">
            <Beaker size={14} />
            Science Backed
          </div>
          <div className="flex items-center gap-2">
            <Leaf size={14} />
            100% Vegan
          </div>
        </div>
      </motion.div>

      {/* Dots */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition ${
              index === currentSlide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;