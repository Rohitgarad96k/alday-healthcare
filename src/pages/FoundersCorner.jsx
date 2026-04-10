import React from 'react';
import { Quote, Leaf, FlaskConical, HeartHandshake, Play, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FoundersCorner = () => {
  return (
    <div className="bg-white font-sans text-gray-900">
     
      {/*1. HERO SECTION */}
      <section className="relative pt-10 pb-20 px-6 overflow-hidden">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="md:w-1/2 relative z-10">
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.25em] mb-6 block animate-fade-in">The Visionary</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] font-serif">
              "We didn't just want <br/> <span className="italic text-gray-400">better</span> skincare. <br/> We wanted <span className="text-[#C5A059]">truth</span>."
            </h1>
            <div className="border-l-4 border-black pl-6 my-10">
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Growing up, I watched the industry sell dilution as solution. I founded Alday Health to strip away the water, the fillers, and the lies—leaving only 100% potent nutrition.
              </p>
            </div>
            <div className="flex items-center gap-4">
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Signature" className="h-12 opacity-80" />
               <div>
                  <p className="font-bold text-sm uppercase tracking-widest">Jhanvi Shah</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Founder & CEO</p>
               </div>
            </div>
          </div>

          {/* Founder Portrait */}
          <div className="md:w-1/2 relative">
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden rounded-sm shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80" 
                alt="Founder" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 filter grayscale group-hover:grayscale-0"
              />
              {/* Floating Quote Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-sm border-l-4 border-[#C5A059] shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                 <p className="text-xs font-bold uppercase tracking-widest mb-2">Our Promise</p>
                 <p className="text-sm italic font-serif">"If it's not active, it's not in the bottle."</p>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#F3E9E2] rounded-full -z-10 blur-3xl opacity-50"></div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT METRICS  */}
      <section className="bg-black text-white py-16">
         <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
            <div>
               <h3 className="text-4xl font-bold text-[#C5A059] mb-2">0%</h3>
               <p className="text-xs uppercase tracking-widest text-gray-400">Chemicals Used</p>
            </div>
            <div>
               <h3 className="text-4xl font-bold text-[#C5A059] mb-2">1M+</h3>
               <p className="text-xs uppercase tracking-widest text-gray-400">Bottles Sold</p>
            </div>
            <div>
               <h3 className="text-4xl font-bold text-[#C5A059] mb-2">100%</h3>
               <p className="text-xs uppercase tracking-widest text-gray-400">Vegan & Cruelty Free</p>
            </div>
            <div>
               <h3 className="text-4xl font-bold text-[#C5A059] mb-2">35+</h3>
               <p className="text-xs uppercase tracking-widest text-gray-400">Global Awards</p>
            </div>
         </div>
      </section>

      {/* --- 3. THE "NO-NONSENSE" LIST --- */}
      <section className="py-24 bg-[#F9F9F9] overflow-hidden">
         <div className="max-w-[1000px] mx-auto px-6 text-center mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">What We Left Out</h2>
            <p className="text-gray-500 max-w-lg mx-auto">We are defined as much by what we exclude as what we include. Our formulation philosophy is strict.</p>
         </div>
         
         {/* Marquee Effect (Simulated with flex wrap for now) */}
         <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {["Sulphates", "Parabens", "Mineral Oil", "Synthetic Fragrance", "Formaldehyde", "Silicones"].map((item) => (
               <div key={item} className="flex items-center gap-2 text-xl font-serif text-gray-400 line-through decoration-red-500 decoration-2">
                  <XCircle size={20} className="text-red-500" /> {item}
               </div>
            ))}
         </div>
      </section>

      {/* --- 4. VIDEO BANNER ("The Lab") --- */}
      <section className="relative h-[500px] bg-gray-900 flex items-center justify-center group overflow-hidden">
         <img 
           src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80" 
           alt="Lab" 
           className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
         />
         <div className="relative z-10 text-center text-white p-8">
            <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-8 cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
               <Play size={24} fill="currentColor" className="ml-1"/>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Behind The Scenes</span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif">Inside The Innovation Lab</h2>
         </div>
      </section>

      {/* --- 5. THE JOURNEY (Timeline) --- */}
      <section className="py-24 px-6 bg-white">
         <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-3xl font-bold uppercase tracking-widest">Our Journey</h2>
            </div>

            <div className="space-y-12 relative border-l border-gray-200 ml-6 md:ml-0 md:pl-0">
               {[
                  { year: "2020", title: "The Inception", desc: "Launched with a single product: The Rosemary Oil Shot." },
                  { year: "2021", title: "Zero Dilution", desc: "Pioneered the 'Zero Water' formulation technology." },
                  { year: "2023", title: "Going Global", desc: "Expanded to 15 countries with 100+ retail stores." },
                  { year: "2025", title: "The Future", desc: "Introducing AI-based Derma Analysis for personalized care." }
               ].map((milestone, i) => (
                  <div key={i} className="relative pl-12 md:pl-0 md:flex md:items-center md:gap-12 group">
                     {/* Dot */}
                     <div className="absolute left-[-5px] top-1 w-3 h-3 bg-gray-300 rounded-full group-hover:bg-[#C5A059] group-hover:scale-150 transition-all md:left-1/2 md:-translate-x-[6px]"></div>
                     
                     {/* Year (Left on Desktop) */}
                     <div className={`md:w-1/2 md:text-right ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                        <span className="text-5xl font-black text-gray-100 group-hover:text-[#C5A059]/20 transition-colors">{milestone.year}</span>
                     </div>

                     {/* Content (Right on Desktop) */}
                     <div className="md:w-1/2">
                        <h4 className="text-xl font-bold mb-2">{milestone.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- 6. CORE PHILOSOPHY ICONS --- */}
      <section className="py-24 px-6 border-t border-gray-100 bg-[#FDFBF7]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <PhilosophyCard 
             icon={<Leaf size={32} />}
             title="100% Natural"
             desc="We don't just use 'extracts'. We use the whole plant power. Vegan, Cruelty-free, and Earth-friendly."
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
          />

        </div>
      </section>

    </div>
  );
};

// Helper Component for Philosophy Cards
const PhilosophyCard = ({ icon, title, desc }) => (
  <div className="text-center group p-8 border border-transparent hover:border-[#C5A059]/20 hover:bg-white transition-all duration-500 rounded-sm">
    <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300 shadow-sm text-gray-800">
      {icon}
    </div>
    <h3 className="text-lg font-bold uppercase tracking-widest mb-4">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">
      {desc}
    </p>
  </div>
);

export default FoundersCorner;