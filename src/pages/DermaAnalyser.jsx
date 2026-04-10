import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Check, RefreshCcw, Loader2, 
  Sun, Moon, Mail, Share2, Upload, Camera, Zap, ChevronDown, ChevronUp, ScanFace
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 

// 🔥 1. Import global context instead of local data.js
import { useProducts } from '../context/ProductContext'; 

const DermaAnalyser = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
  // 🔥 2. Grab real products from your database!
  const { products } = useProducts();

  // --- STATES ---
  const [view, setView] = useState('landing'); 
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [routine, setRoutine] = useState({ am: [], pm: [] });
  const [expertTip, setExpertTip] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null); 

  // --- 1. LANDING PAGE HANDLERS ---
  const startAnalysis = (type) => {
    setAnswers({ focus: type });
    setView('quiz');
    setStep(1); 
  };

  // --- 2. QUIZ LOGIC ---
  const questions = [
    {
      id: 'concern',
      title: "Primary Concern",
      question: "What is your main goal today?",
      getOptions: (prev) => {
        if (prev.focus === "Hair Care") return ["Hair Fall Control", "Dandruff Relief", "Hair Growth", "Damage Repair"];
        return ["Acne Control", "Pigmentation", "Anti-Aging", "Glow & Radiance"];
      }
    },
    {
      id: 'type',
      title: "Type",
      question: "How would you describe your texture?",
      getOptions: (prev) => {
        if (prev.focus === "Hair Care") return ["Dry & Frizzy", "Oily & Greasy", "Normal / Balanced", "Thinning"];
        return ["Dry Skin", "Oily Skin", "Combination", "Sensitive"];
      }
    },
    {
      id: 'intensity',
      title: "Severity",
      question: "How long have you faced this?",
      options: ["Less than a month", "1-6 Months", "Chronic (Years)"]
    }
  ];

  const handleOptionClick = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep('upload'); 
    }
  };

  // --- 3. ACTUAL FILE UPLOAD HANDLER ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImagePreview(imageUrl);
      startScanSimulation();
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startScanSimulation = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15; 
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        generateRoutine();
      }
    }, 400);
  };

  // 🔥 4. Generates routine using REAL DB products!
  const generateRoutine = () => {
    setStep('analyzing');
    setTimeout(() => {
      // Filter out Drafts
      const activeProducts = products.filter(p => p.status !== 'Draft');
      
      // Try to find products that match their selected focus (Skincare/Haircare)
      let relevantProducts = activeProducts.filter(p => {
         const cat = Array.isArray(p.category) ? p.category.join(' ') : (p.category || '');
         return cat.includes(answers.focus) || p.concern?.includes(answers.focus);
      });

      // Fallback: If we don't have enough matching products, just grab any active ones
      if (relevantProducts.length < 3) {
         relevantProducts = [...activeProducts];
      }

      // Ensure we have at least something to show
      const safeProducts = relevantProducts.slice(0, 3);
      
      const amRoutine = safeProducts.length >= 2 ? [safeProducts[0], safeProducts[1]] : safeProducts;
      const pmRoutine = safeProducts.length >= 3 ? [safeProducts[0], safeProducts[2]] : safeProducts;

      setRoutine({ am: amRoutine, pm: pmRoutine });
      setExpertTip(`Based on your AI Scan for ${answers.concern || 'your concerns'}, your barrier needs strengthening before active treatment.`);
      setStep('results');
    }, 2500);
  };

  return (
    // 🔥 FIX: Removed pt-[104px] here so it sits flush under the Navbar!
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">
      
      <AnimatePresence mode="wait">
        {/* VIEW 1: LANDING PAGE */}
        {view === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {/* --- HERO SECTION --- */}
            <section className="relative bg-[#F4F4F4] py-20 px-6 overflow-hidden">
               <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-1/2 z-10">
                     <span className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-4 block">New Launch</span>
                     <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">DermaBot<span className="text-[#C5A059]">.</span></h1>
                     <p className="text-lg text-gray-600 mb-10 max-w-md">
                       Know what your skin & hair needs instantly with <b>AI based Derma analysis</b>.
                     </p>
                     
                     <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => startAnalysis("Haircare")}
                          className="bg-black text-white px-8 py-4 uppercase text-xs font-bold tracking-[0.15em] hover:bg-gray-800 transition-all shadow-lg"
                        >
                          Start Hair Analysis
                        </button>
                        <button 
                          onClick={() => startAnalysis("Skincare")}
                          className="bg-white text-black border border-black px-8 py-4 uppercase text-xs font-bold tracking-[0.15em] hover:bg-gray-50 transition-all shadow-lg"
                        >
                          Start Skin Analysis
                        </button>
                     </div>
                  </div>
                  
                  {/* Hero Image (Scanning Face) */}
                  <div className="md:w-1/2 relative">
                     <div className="absolute inset-0 border-2 border-[#C5A059]/30 rounded-full animate-ping opacity-20"></div>
                     <img 
                       src="https://images.unsplash.com/photo-1725000421356-d69d04370385?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEFJJTIwYmFzZWQlMjBEZXJtYSUyMGFuYWx5c2lzLnxlbnwwfHwwfHx8MA%3D%3D" 
                       alt="AI Analysis" 
                       className="w-full h-auto rounded-lg shadow-2xl relative z-10"
                     />
                     <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-[#C5A059] shadow-[0_0_20px_#C5A059] z-20 animate-scan"></div>
                  </div>
               </div>
            </section>

            {/* --- 3-STEP PROCESS --- */}
            <section className="py-24 px-6 max-w-[1200px] mx-auto text-center">
               <h2 className="text-3xl font-bold mb-16 uppercase tracking-widest">Simple 3-Step Process</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[
                    { title: "Take a Quick Quiz", desc: "Answer questions about your type & goals.", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400" },
                    { title: "Upload a Selfie", desc: "Our AI scans 50+ skin parameters.", img: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbmFsJTIwY2FyZXxlbnwwfHwwfHx8MA%3D%3D" },
                    { title: "Receive Routine", desc: "Get a clinical prescription instantly.", img: "https://images.unsplash.com/photo-1599847987657-881f11b92a75?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
                  ].map((item, i) => (
                    <div key={i} className="group cursor-default">
                       <div className="h-64 overflow-hidden rounded-sm mb-6 relative">
                          <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title}/>
                          <div className="absolute top-4 left-4 bg-black text-white w-8 h-8 flex items-center justify-center font-bold rounded-full">
                              {i+1}
                          </div>
                       </div>
                       <h3 className="text-lg font-bold uppercase tracking-wide mb-2">{item.title}</h3>
                       <p className="text-sm text-gray-500 max-w-xs mx-auto">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* --- WHY DERMA ANALYSER --- */}
            <section className="bg-[#F9F9F9] py-24 px-6">
               <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center gap-16">
                  <div className="md:w-1/2">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">Why It Works</span>
                     <h2 className="text-3xl font-bold mb-6">Precision Over Guesswork</h2>
                     <ul className="space-y-4">
                        {["AI-Driven accuracy matching 95% of dermatologists", "Hyper-personalized ingredient mapping", "Tracks progress over time"].map((pt, i) => (
                          <li key={i} className="flex gap-4 items-center text-sm text-gray-700">
                             <Check size={18} className="text-[#C5A059]" /> {pt}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="md:w-1/2">
                     <img src="https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800" className="rounded-sm shadow-xl" alt="Report" />
                  </div>
               </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="bg-black text-white py-24 px-6">
               <div className="max-w-[800px] mx-auto">
                  <h2 className="text-2xl font-bold mb-12 text-center uppercase tracking-widest">Commonly Asked Questions</h2>
                  <div className="space-y-4">
                     <FAQItem question="Why should I use Derma Analyser?" answer="It eliminates trial and error by analyzing your unique skin/hair profile to recommend products that actually work." />
                     <FAQItem question="How long does it take?" answer="Less than 2 minutes. A quick quiz and a photo scan is all it takes." />
                     <FAQItem question="Is my photo saved?" answer="No. Your photo is processed instantly for analysis and then deleted. We value your privacy." />
                  </div>
               </div>
            </section>

          </motion.div>
        )}
        
        {/* VIEW 2: QUIZ & RESULTS WIZARD */}
        {view === 'quiz' && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-center items-center px-6 py-12 max-w-[800px] mx-auto w-full"
          >
             
             {/* QUIZ HEADER */}
             {step !== 'results' && step !== 'analyzing' && (
               <div className="w-full mb-8">
                 <div className="flex justify-between items-center mb-4">
                   <button onClick={() => setView('landing')} className="text-xs text-gray-400 hover:text-black uppercase font-bold tracking-widest">Exit</button>
                   <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">DermaBot AI</span>
                 </div>
                 {/* Progress Bar */}
                 <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                   <div className="bg-black h-full transition-all duration-500" style={{ width: typeof step === 'number' ? `${(step/4)*100}%` : '90%' }}></div>
                 </div>
               </div>
             )}

             <AnimatePresence mode="wait">
               {/* --- STEP: QUESTIONS --- */}
               {typeof step === 'number' && (
                 <motion.div 
                   key={`step-${step}`}
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   className="w-full"
                 >
                    <h2 className="text-3xl font-bold mb-10 text-center">{questions[step-1].question}</h2>
                    <div className="grid gap-4">
                       {(questions[step-1].getOptions ? questions[step-1].getOptions(answers) : questions[step-1].options).map((opt, i) => (
                          <button key={i} onClick={() => handleOptionClick(questions[step-1].id, opt)} className="border p-5 rounded-sm hover:border-black hover:bg-gray-50 text-left flex justify-between group">
                             <span className="font-medium group-hover:font-bold">{opt}</span>
                             <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={20}/>
                          </button>
                       ))}
                    </div>
                 </motion.div>
               )}

               {/* --- STEP: UPLOAD PHOTO --- */}
               {step === 'upload' && (
                 <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center">
                    
                    {/* Hidden File Input */}
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />

                    <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100">
                      {uploadedImagePreview ? (
                         <>
                           <img src={uploadedImagePreview} alt="User Upload" className="w-full h-full object-cover" />
                           {uploadProgress > 0 && uploadProgress < 100 && (
                             <div className="absolute top-0 left-0 right-0 h-1 bg-[#C5A059] shadow-[0_0_15px_#C5A059] z-10 animate-scan" />
                           )}
                         </>
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <Camera size={40} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Let's Scan Your Face</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upload a clear selfie for our AI to detect micro-concerns invisible to the naked eye.</p>
                    
                    {uploadProgress > 0 && uploadProgress < 100 ? (
                       <div className="w-full max-w-sm mx-auto">
                          <div className="flex justify-between text-xs font-bold mb-2"><span>Scanning...</span><span>{Math.min(uploadProgress, 100)}%</span></div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                             <div className="bg-[#C5A059] h-full transition-all" style={{width: `${uploadProgress}%`}}></div>
                          </div>
                       </div>
                    ) : (
                       <button onClick={triggerFileInput} className="bg-black text-white px-10 py-4 uppercase text-xs font-bold tracking-[0.2em] rounded-sm hover:bg-gray-800 flex items-center gap-2 mx-auto">
                          <Upload size={16}/> Upload Photo
                       </button>
                    )}
                    
                    {!uploadedImagePreview && (
                      <button onClick={() => startScanSimulation()} className="block mt-6 text-gray-400 text-xs underline mx-auto hover:text-black">Skip this step</button>
                    )}
                 </motion.div>
               )}

               {/* STEP: ANALYZING  */}
               {step === 'analyzing' && (
                 <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-6 text-[#C5A059]" />
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-2">DermaBot is thinking...</h3>
                    <p className="text-gray-500 text-xs">Processing via Alday AI Core</p>
                 </motion.div>
               )}

               {/* STEP: RESULTS*/}
               {step === 'results' && (
                 <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                    <div className="text-center mb-12">
                       <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2 block">Analysis Complete</span>
                       <h1 className="text-3xl font-bold mb-2">Your Personal Ritual</h1>
                       <p className="text-sm text-gray-500">Tailored for: <b>{answers.concern}</b> & <b>{answers.type}</b></p>
                    </div>

                    {/* Expert Tip */}
                    <div className="bg-[#F0F8FF] border-l-4 border-blue-500 p-4 mb-10 rounded-r-sm flex gap-4 items-start">
                       <Zap size={24} className="text-blue-500 flex-shrink-0 mt-1" />
                       <div>
                          <h4 className="font-bold text-xs uppercase tracking-widest text-blue-800 mb-1">Derma Insight</h4>
                          <p className="text-sm text-blue-900 leading-relaxed">{expertTip}</p>
                       </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <h3 className="font-bold text-lg uppercase tracking-widest mb-4 flex items-center gap-2"><Sun size={18}/> Morning</h3>
                          {routine.am.length > 0 ? routine.am.map((p, i) => (
                             <div key={i} className="flex gap-4 mb-4 border p-3 rounded-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${p.id || p._id}`)}>
                                <img src={p.image || p.imageUrl || "https://via.placeholder.com/150"} className="w-16 h-16 object-contain mix-blend-multiply rounded-sm" alt={p.name}/>
                                <div>
                                   <p className="text-[10px] font-bold text-[#C5A059] uppercase">Step {i+1}</p>
                                   <h4 className="font-bold text-sm line-clamp-2">{p.name}</h4>
                                </div>
                             </div>
                          )) : <p className="text-sm text-gray-500">Add products to your store first!</p>}
                       </div>
                       <div>
                          <h3 className="font-bold text-lg uppercase tracking-widest mb-4 flex items-center gap-2"><Moon size={18}/> Night</h3>
                          {routine.pm.length > 0 ? routine.pm.map((p, i) => (
                             <div key={i} className="flex gap-4 mb-4 border p-3 rounded-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${p.id || p._id}`)}>
                                <img src={p.image || p.imageUrl || "https://via.placeholder.com/150"} className="w-16 h-16 object-contain mix-blend-multiply rounded-sm" alt={p.name}/>
                                <div>
                                   <p className="text-[10px] font-bold text-[#C5A059] uppercase">Step {i+1}</p>
                                   <h4 className="font-bold text-sm line-clamp-2">{p.name}</h4>
                                </div>
                             </div>
                          )) : <p className="text-sm text-gray-500">Add products to your store first!</p>}
                       </div>
                    </div>

                    <button 
                      onClick={() => {
                        setStep(1); 
                        setView('landing'); 
                        setUploadedImagePreview(null);
                        setUploadProgress(0);
                      }} 
                      className="w-full mt-12 border border-black py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
                    >
                      Start New Analysis
                    </button>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- FAQ Component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-800">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center py-4 text-left hover:text-[#C5A059] transition-colors"
      >
        <span className="font-bold text-sm tracking-wide">{question}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-24 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default DermaAnalyser;