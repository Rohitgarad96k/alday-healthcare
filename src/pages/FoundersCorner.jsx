import React from 'react';
import { Leaf, FlaskConical, HeartHandshake, XCircle, MapPin, Mail, Phone, Droplet, Sparkles, ShieldCheck } from 'lucide-react';
import founderImg from '../assets/founder_photo.jpeg';

const FoundersCorner = () => {
  return (
    <div className="bg-[#fdfbf7] font-sans text-gray-900 selection:bg-[#C5A059] selection:text-white">
     
      {/* --- 1. HERO SECTION (Balanced & Professional) --- */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden bg-[#fdfbf7]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          
          {/* Text Content */}
          <div className="md:w-[60%] relative z-10 text-center md:text-left">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-6">
                <span className="w-8 h-[2px] bg-[#C5A059]"></span>
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.3em] animate-fade-in">Direct from the Founder</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-[1.15] font-serif text-slate-950">
              "We didn't just want <br className="hidden md:block"/> <span className="italic text-[#C5A059] font-light">better</span> healthcare.<br/> 
              We wanted <span className="underline decoration-[#C5A059] decoration-4 underline-offset-8">truth</span>."
            </h1>
            
            <div className="my-8 md:my-10 bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none relative">
              <span className="absolute -top-4 -left-2 text-6xl text-gray-200 font-serif md:hidden">"</span>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium relative z-10">
                Growing up, I watched the industry sell dilution as solution. I founded Alday Health to strip away the water, the fillers, and the lies—leaving only 100% potent nutrition.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none max-w-sm mx-auto md:mx-0 border border-gray-100 md:border-none">
               <img src="https://img.freepik.com/premium-vector/quill-signature-logo-design-inspiration_57043-204.jpg" alt="Signature" className="h-10 md:h-14 opacity-80" />
               <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-[#C5A059]/30 pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
                  {/* PLACEHOLDER: Place Founder's Full Name below */}
                  <p className="font-bold text-sm md:text-base uppercase tracking-widest text-slate-900">Kaushik Domadiya</p>
                  <p className="text-[10px] md:text-xs text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-1">Founder & CEO</p>
               </div>
            </div>
          </div>

          {/* Founder Portrait (Reduced Size for better balance) */}
          <div className="md:w-[40%] relative w-full max-w-sm mx-auto mt-8 md:mt-0">
            {/* Simple Decorative Element for Desktop */}
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-[#C5A059]/30 rounded-2xl md:rounded-sm z-0 hidden md:block"></div>

            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden rounded-2xl md:rounded-sm shadow-xl z-10 group">
              <img 
                // Assuming a stock image structure for now. Make sure to replace with actual stock image.
                src={founderImg} 
                alt="Founder Portrait - Placeholder" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. THE "NO-NONSENSE" LIST (Simplified Premium) --- */}
      <section className="py-16 md:py-24 bg-white overflow-hidden border-y border-gray-100">
         <div className="max-w-[1000px] mx-auto px-6 text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-widest mb-4 text-slate-900">What We Left Out</h2>
            <p className="text-gray-700 max-w-xl mx-auto font-medium text-sm md:text-base">We are defined as much by what we exclude as what we include. Our formulation philosophy is unapologetically strict.</p>
         </div>
         
         <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto px-4">
            {["Sulphates", "Parabens", "Mineral Oil", "Synthetic Fragrance", "Formaldehyde", "Silicones"].map((item) => (
               <div key={item} className="flex items-center gap-2 px-5 py-3 md:px-6 md:py-4 bg-gray-50 rounded-full shadow-inner border border-gray-200 group">
                  <XCircle size={18} className="text-red-500 group-hover:scale-110 transition-transform" /> 
                  <span className="text-sm md:text-lg font-serif text-gray-600 line-through decoration-red-400 decoration-2 group-hover:text-red-900 transition-colors">{item}</span>
               </div>
            ))}
         </div>
      </section>

      {/* --- 3. PREMIUM PRODUCT SPOTLIGHT (Updated with Clean Image) --- */}
      <section className="py-20 md:py-32 px-6 bg-white relative overflow-hidden border-b border-gray-100">
         <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
            
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
               <div className="inline-block bg-[#C5A059]/10 text-[#C5A059] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-2">
                  Signature Formulation
               </div>
               <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight">Nature's Potency,<br/> Bottled.</h2>
               <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                  Witness the culmination of our zero-dilution philosophy. Every product is a testament to our commitment to pure, unadulterated plant power designed to transform your daily rituals.
               </p>
               
               <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100 mt-8 text-left">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                     <Droplet className="text-[#C5A059] mb-3" size={28} />
                     <h4 className="font-bold text-slate-900 mb-1">Zero Water</h4>
                     <p className="text-sm text-gray-500">No fillers, just 100% active botanical ingredients.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                     <ShieldCheck className="text-[#C5A059] mb-3" size={28} />
                     <h4 className="font-bold text-slate-900 mb-1">Clinically Proven</h4>
                     <p className="text-sm text-gray-500">Tested rigorously for safety and profound efficacy.</p>
                  </div>
               </div>
            </div>

            <div className="lg:w-1/2 w-full max-w-md lg:max-w-none mx-auto relative group">
               {/* Simplified Premium Image Frame */}
               <div className="absolute inset-0 bg-[#C5A059] rounded-3xl transform rotate-3 scale-105 opacity-10 group-hover:rotate-6 transition-transform duration-700"></div>
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img 
                     // UPDATED: Using the exact product image you provided
                     src="https://res.cloudinary.com/djiksysxg/image/upload/v1772690432/WhatsApp_Image_2026-03-03_at_10.24.06_AM_j7ptr4.jpg" 
                     alt="Alday Product Spotlight - Cleaner Look" 
                     className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  {/* Very Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-40"></div>
               </div>
            </div>

         </div>
      </section>

      {/* --- 4. CORE PHILOSOPHY ICONS (Monochromatic Grid) --- */}
      <section className="py-20 md:py-24 px-6 bg-[#fcfbf9] text-gray-900">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
             <span className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-2 block">Our Standards</span>
             <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-slate-950">The Alday Commitment</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            <PhilosophyCard 
               icon={<Leaf size={32} />}
               title="100% Natural"
               desc="We don't just use 'extracts'. We use whole plant power. Vegan, Cruelty-free, and Earth-friendly."
            />
            <PhilosophyCard 
               icon={<FlaskConical size={32} />}
               title="Clinical Potency"
               desc="Our formulations contain 0% water. Every drop in the bottle is an active ingredient working for you."
            />
            <PhilosophyCard 
               icon={<HeartHandshake size={32} />}
               title="Radical Honesty"
               desc="We declare the percentage of every ingredient on the front of our packaging. Nothing to hide."
               className="sm:col-span-2 md:col-span-1 max-w-md mx-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* --- 5. THE JOURNEY (Simplified Timeline) --- */}
      <section className="py-20 md:py-32 px-6 bg-white border-y border-gray-100">
         <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-16 md:mb-24">
               <span className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-2 block">Our History</span>
               <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-950">A Decade of Truth</h2>
            </div>

            <div className="space-y-12 relative border-l-2 border-gray-100 ml-4 md:ml-0 md:pl-0">
               {[
                  { year: "2016", title: "The Inception", desc: "Alday Healthcare India Ltd was officially established on October 10th in Rajkot." },
                  { year: "2018", title: "Zero Dilution", desc: "Pioneered our signature 'Zero Water' formulation technology." },
                  { year: "2021", title: "Going Global", desc: "Expanded our operations across India with widespread distribution." },
                  { year: "2024", title: "The Future", desc: "Introducing AI-based Derma Analysis for personalized clinical care." }
               ].map((milestone, i) => (
                  <div key={i} className="relative pl-8 md:pl-0 md:flex md:items-center md:gap-16 group">
                     {/* Simplified Dot */}
                     <div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-4 border-gray-200 rounded-full group-hover:border-[#C5A059] transition-all md:left-1/2 md:-translate-x-[8px] z-10 shadow-sm"></div>
                     
                     {/* Clean Year Display */}
                     <div className={`md:w-1/2 md:text-right ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                        <span className="text-4xl md:text-6xl font-black text-[#F3E9E2] group-hover:text-[#C5A059] transition-colors duration-500 drop-shadow-sm">{milestone.year}</span>
                     </div>

                     {/* Simplified Content Block */}
                     <div className="md:w-1/2 pt-2 md:pt-0">
                        <h4 className="text-lg md:text-2xl font-bold mb-2 text-slate-800">{milestone.title}</h4>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">{milestone.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- 6. CONTACT & HEADQUARTERS (Premium Simplicity) --- */}
      <section className="py-20 md:py-32 bg-white border-t border-gray-100 selection:bg-slate-900 selection:text-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <span className="w-12 h-[2px] bg-[#C5A059] mx-auto mb-6 block"></span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-slate-900">Alday Headquarters</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Get In Touch With The Team</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {/* Address - Opens Google Maps */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Alday+Healthcare+India+Ltd+Umiya-4+Ribda+Rajkot+Gujarat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 border border-gray-100 hover:border-[#C5A059]/30 hover:shadow-xl transition-all duration-300 rounded-3xl bg-white group cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#F3E9E2] group-hover:bg-[#C5A059] rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
                <MapPin className="text-[#C5A059] group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-900 group-hover:text-[#C5A059] transition-colors">Location</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Alday Healthcare India Ltd<br />
                Umiya-4, Ribda<br />
                Rajkot, Gujarat
              </p>
              <span className="mt-4 text-[10px] uppercase tracking-widest font-bold text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">Open in Maps</span>
            </a>

            {/* Email - Opens Mail Client */}
            <a 
              href="mailto:alday.rajkot@gmail.com"
              className="flex flex-col items-center p-8 border border-gray-100 hover:border-[#C5A059]/30 hover:shadow-xl transition-all duration-300 rounded-3xl bg-white group cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#F3E9E2] group-hover:bg-[#C5A059] rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
                <Mail className="text-[#C5A059] group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-900 group-hover:text-[#C5A059] transition-colors">Email Us</h3>
              <p className="text-gray-500 text-sm font-medium">alday.rajkot@gmail.com</p>
              <span className="mt-4 text-[10px] uppercase tracking-widest font-bold text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">Compose Mail</span>
            </a>

            {/* Phone - Triggers Dialpad */}
            <a 
              href="tel:+918487965500"
              className="flex flex-col items-center p-8 border border-gray-100 hover:border-[#C5A059]/30 hover:shadow-xl transition-all duration-300 rounded-3xl bg-white group cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#F3E9E2] group-hover:bg-[#C5A059] rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
                <Phone className="text-[#C5A059] group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-900 group-hover:text-[#C5A059] transition-colors">Call Us</h3>
              <p className="text-gray-500 text-sm font-mono font-medium tracking-wide">+91 84879 65500</p>
              <span className="mt-4 text-[10px] uppercase tracking-widest font-bold text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">Start Call</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

// Simplified, monochromatic Philosophy Card Helper
const PhilosophyCard = ({ icon, title, desc, className = "" }) => (
  <div className={`flex flex-col items-center text-center p-8 border border-gray-100 hover:-translate-y-2 transition-all duration-300 rounded-3xl bg-white shadow-sm hover:shadow-md hover:border-[#C5A059]/30 ${className}`}>
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#fcfbf9] text-gray-800 border border-gray-100 shadow-inner">
      {icon}
    </div>
    <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-slate-900">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);

export default FoundersCorner;