import React, { useState } from 'react';
import { Leaf, Droplet, Sun } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { ingredients } from '../data'; // Import data

// Map string keys from data.js to actual React Components
const iconMap = {
  Leaf: <Leaf />,
  Sun: <Sun />,
  Droplet: <Droplet />
};

const IngredientSpotlight = () => {
  const [active, setActive] = useState(ingredients[0]);

  return (
    // Adjusted padding for mobile, kept original for laptop (lg:py-24)
    <section className="py-16 lg:py-24 bg-[#F8F9FA] border-t border-gray-100 overflow-hidden">
      
      {/* Hide native scrollbar for mobile swipeable menu */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-[10px] md:text-xs font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-3 md:mb-4 block">
            Clinical Efficacy
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest text-black mb-3 md:mb-4">
            Powered by Nature, Backed by Science
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Discover the potent actives behind our zero-dilution formulations.
          </p>
        </div>

        {/* Adjusted gap for mobile, kept original for laptop (lg:gap-16) */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center lg:items-start">
          
          {/* Left: Interactive Menu */}
          {/* Made horizontally swipeable on mobile/tablet, vertical on laptop */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-3 md:gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar snap-x">
            {ingredients.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item)}
                // Fixed widths on mobile so they swipe nicely, full width on laptop
                className={`flex items-center gap-4 md:gap-5 p-4 md:p-6 text-left transition-all duration-300 rounded-sm border shrink-0 snap-start w-[85%] sm:w-[320px] lg:w-full ${
                  active.id === item.id 
                    ? 'bg-white border-[#C5A059] shadow-md lg:shadow-lg transform lg:translate-x-4' 
                    : 'bg-transparent border-gray-200 lg:border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className={`p-3 md:p-4 rounded-full transition-colors duration-300 flex-shrink-0 ${active.id === item.id ? 'bg-[#C5A059] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                  {/* Render Icon dynamically using the map */}
                  {iconMap[item.iconName]}
                </div>
                <div>
                  <h4 className={`font-bold text-sm md:text-lg uppercase tracking-wide transition-colors duration-300 ${active.id === item.id ? 'text-black' : 'text-gray-500'}`}>
                    {item.name}
                  </h4>
                  {active.id === item.id && (
                     <p className="text-[9px] md:text-[10px] text-[#C5A059] uppercase tracking-widest mt-1 animate-fade-in">Active Selection</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Center: Image (NOW A CLICKABLE LINK) */}
          {/* Responsive height, but kept EXACTLY h-[450px] for laptops */}
          <Link 
            to={`/view-all?search=${active.name}`} 
            key={`img-${active.id}`} 
            className="block w-full lg:w-1/3 relative h-[350px] md:h-[400px] lg:h-[450px] rounded-sm overflow-hidden shadow-xl lg:shadow-2xl group animate-fade-in cursor-pointer"
          >
            <img 
              src={active.image} 
              alt={active.name} 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 text-white z-10">
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 md:mb-2 text-gray-300">Source: Natural Origin</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">{active.name} Extract</h3>
            </div>
            
            {/* Added a subtle hover overlay indicating it's clickable */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
               <span className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 md:px-6 py-2.5 md:py-3 border border-white/50 rounded-sm transform translate-y-4 group-hover:translate-y-0 text-center">
                 Shop {active.name}
               </span>
            </div>
          </Link>

          {/* Right: Details */}
          <div key={`details-${active.id}`} className="w-full lg:w-1/3 animate-fade-in-up mt-4 lg:mt-0">
            <div className="mb-6 md:mb-8 border-b border-gray-200 pb-6 md:pb-8">
               <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4 leading-tight">{active.title}</h3>
               <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                 {active.desc}
               </p>
            </div>
            
            <div>
               <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 md:mb-6">Clinically Proven Results</h4>
               <ul className="space-y-4 md:space-y-5">
                 {active.stats.map((stat, idx) => (
                   <li key={idx} className="flex items-start gap-3 md:gap-4 group/stat">
                     <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/stat:border-[#C5A059] transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></div>
                     </div>
                     <span className="font-medium text-gray-700 text-sm leading-relaxed">{stat}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IngredientSpotlight;