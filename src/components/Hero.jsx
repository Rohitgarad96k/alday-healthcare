import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { heroSlides } from '../data'; //1. Import data from central file

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const slides = heroSlides; // Use the imported data
  const navigate = useNavigate(); // 2. INITIALIZE HOOK

  // Auto-scroll effect (changes every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className={`relative transition-colors duration-700 ease-in-out ${slides[current].bgColor} min-h-[500px] md:h-[650px] w-full overflow-hidden flex items-center`}>
      
      {/* Arrow Navigation */}
      <button onClick={prevSlide} className="absolute left-4 z-20 p-3 rounded-full bg-white/50 hover:bg-white hidden md:block transition-all shadow-sm">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 z-20 p-3 rounded-full bg-white/50 hover:bg-white hidden md:block transition-all shadow-sm">
        <ChevronRight size={24} />
      </button>

      {/* Main Content Container */}
      <div className="max-w-[1400px] mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10 h-full">
        
        {/* Left: Text Content */}
        <div className="order-2 md:order-1 pb-16 md:pb-0 transition-opacity duration-500 ease-in-out flex flex-col justify-center">
          <span className="block text-sm md:text-base font-bold tracking-widest uppercase mb-4 text-gray-900">
            {slides[current].tag}
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {slides[current].title}
          </h1>
          
          <p className="text-xl md:text-2xl font-light text-gray-800 mb-8 leading-snug">
             {slides[current].subtitle.split(' ').slice(0, 3).join(' ')} <br/>
            <span className="font-medium">{slides[current].subtitle.split(' ').slice(3).join(' ')}</span>
          </p>
          
          <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-700 mb-10">
            {slides[current].features.map((feature, index) => (
              <React.Fragment key={index}>
                <span>{feature}</span>
                {index < slides[current].features.length - 1 && <span className="hidden sm:inline text-gray-400">|</span>}
              </React.Fragment>
            ))}
          </div>

          <div>
            {/* 3. UPDATED BUTTON WITH NAVIGATION */}
            <button 
              onClick={() => navigate('/view-all')} 
              className="bg-black text-white px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl transform hover:-translate-y-1"
            >
              {slides[current].buttonText}
            </button>
          </div>
        </div>

        {/* Right: Image (Product) */}
        <div className="relative order-1 md:order-2 flex justify-center items-center h-[350px] md:h-full w-full">
          <img 
            key={current} 
            src={slides[current].image} 
            alt={slides[current].title} 
            // Ensures image fits perfectly without cropping or overflow
            className="object-contain max-h-[70%] md:max-h-[75%] w-auto mix-blend-multiply drop-shadow-2xl animate-fade-in-up transform hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              current === index ? 'w-10 h-1 bg-black' : 'w-2 h-1 bg-gray-400/50 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;