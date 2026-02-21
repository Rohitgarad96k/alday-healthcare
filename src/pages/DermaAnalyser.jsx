import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Check, RefreshCcw, Loader2, 
  Sun, Moon, Mail, Share2, Upload, Camera, Zap, ChevronDown, ChevronUp, ScanFace
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { products } from '../data';

const DermaAnalyser = () => {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [view, setView] = useState('landing'); // 'landing' or 'quiz'
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [routine, setRoutine] = useState({ am: [], pm: [] });
  const [expertTip, setExpertTip] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- 1. LANDING PAGE HANDLERS ---
  const startAnalysis = (type) => {
    setAnswers({ focus: type });
    setView('quiz');
    setStep(1); // Start at Question 1 (skipping focus selection since button defined it)
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
      setStep('upload'); // Go to new Photo Upload step
    }
  };

  const handlePhotoUpload = () => {
    // Simulate Upload & Scan
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        generateRoutine();
      }
    }, 300);
  };

  const generateRoutine = () => {
    setStep('analyzing');
    setTimeout(() => {
      // Logic to find products
      const relevantProducts = products.filter(p => 
        (p.category === "Hair Care" || p.category === "Skincare") // broader filter for demo
      ).slice(0, 3); // Just grab 3 for demo

      setRoutine({ am: [relevantProducts[0], relevantProducts[1]], pm: [relevantProducts[0], relevantProducts[2]] });
      setExpertTip("Based on your AI Scan, your skin barrier needs strengthening before active treatment.");
      setStep('results');
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">

      {/* VIEW 1: LANDING PAGE (Matches Image) */}

      {view === 'landing' && (
        <div className="animate-fade-in">
          
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
                        onClick={() => startAnalysis("Hair Care")}
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
                     src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80" 
                     alt="AI Analysis" 
                     className="w-full h-auto rounded-lg shadow-2xl relative z-10"
                   />
                   {/* Scanning Overlay Lines */}
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
                  { title: "Upload a Selfie", desc: "Our AI scans 50+ skin parameters.", img: "https://images.unsplash.com/photo-1590611936760-eeb9f59d7d64?w=400" },
                  { title: "Receive Routine", desc: "Get a clinical prescription instantly.", img: "https://images.unsplash.com/photo-1556228578-8d8448ad1d4d?w=400" }
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

          {/* --- HOW TO TAKE PHOTO --- */}
          <section className="py-24 px-6 max-w-[1000px] mx-auto text-center">
             <h2 className="text-2xl font-bold mb-16 uppercase tracking-widest">How to take a clear photo?</h2>
             <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                   <div className="w-20 h-20 border-2 border-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                      <Camera size={32} />
                   </div>
                   <h4 className="font-bold text-sm uppercase">1. Clear Photo</h4>
                   <p className="text-xs text-gray-500 mt-2">Remove glasses & makeup</p>
                </div>
                <div className="flex flex-col items-center">
                   <div className="w-20 h-20 border-2 border-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                      <Sun size={32} />
                   </div>
                   <h4 className="font-bold text-sm uppercase">2. Good Lighting</h4>
                   <p className="text-xs text-gray-500 mt-2">Use natural daylight</p>
                </div>
                <div className="flex flex-col items-center">
                   <div className="w-20 h-20 border-2 border-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                      <ScanFace size={32} />
                   </div>
                   <h4 className="font-bold text-sm uppercase">3. Position Face</h4>
                   <p className="text-xs text-gray-500 mt-2">Keep face within frame</p>
                </div>
             </div>
          </section>

          {/* --- FAQ SECTION (Accordion) --- */}
          <section className="bg-black text-white py-24 px-6">
             <div className="max-w-[800px] mx-auto">
                <h2 className="text-2xl font-bold mb-12 text-center uppercase tracking-widest">Commonly Asked Questions</h2>
                <div className="space-y-4">
                   <FAQItem question="Why should I use Derma Analyser?" answer="It eliminates trial and error by analyzing your unique skin/hair profile to recommend products that actually work." />
                   <FAQItem question="How long does it take?" answer="Less than 2 minutes. A quick quiz and a photo scan is all it takes." />
                   <FAQItem question="Is my photo saved?" answer="No. Your photo is processed instantly for analysis and then deleted. We value your privacy." />
                   <FAQItem question="Do I have to pay?" answer="No, the Derma Analyser tool is completely free to use." />
                </div>
             </div>
          </section>

        </div>
      )}
      
      {/* VIEW 2: QUIZ & RESULTS WIZARD */}

      {view === 'quiz' && (
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 max-w-[800px] mx-auto w-full">
           
           {/* QUIZ HEADER */}
           {step !== 'results' && (
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

           {/* --- STEP: QUESTIONS --- */}
           {typeof step === 'number' && (
             <div className="w-full animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-10 text-center">{questions[step-1].question}</h2>
                <div className="grid gap-4">
                   {(questions[step-1].getOptions ? questions[step-1].getOptions(answers) : questions[step-1].options).map((opt, i) => (
                      <button key={i} onClick={() => handleOptionClick(questions[step-1].id, opt)} className="border p-5 rounded-sm hover:border-black hover:bg-gray-50 text-left flex justify-between group">
                         <span className="font-medium group-hover:font-bold">{opt}</span>
                         <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={20}/>
                      </button>
                   ))}
                </div>
             </div>
           )}

           {/* --- STEP: UPLOAD PHOTO --- */}
           {step === 'upload' && (
             <div className="w-full text-center animate-fade-in">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Camera size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Let's Scan Your Face</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upload a clear selfie for our AI to detect micro-concerns invisible to the naked eye.</p>
                
                {uploadProgress > 0 && uploadProgress < 100 ? (
                   <div className="w-full max-w-sm mx-auto">
                      <div className="flex justify-between text-xs font-bold mb-2"><span>Scanning...</span><span>{uploadProgress}%</span></div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-[#C5A059] h-full transition-all" style={{width: `${uploadProgress}%`}}></div></div>
                   </div>
                ) : (
                   <button onClick={handlePhotoUpload} className="bg-black text-white px-10 py-4 uppercase text-xs font-bold tracking-[0.2em] rounded-sm hover:bg-gray-800 flex items-center gap-2 mx-auto">
                      <Upload size={16}/> Upload / Take Photo
                   </button>
                )}
                
                <button onClick={() => generateRoutine()} className="block mt-6 text-gray-400 text-xs underline mx-auto hover:text-black">Skip this step</button>
             </div>
           )}

           {/* STEP: ANALYZING  */}
           {step === 'analyzing' && (
             <div className="text-center animate-pulse">
                <Loader2 size={48} className="animate-spin mx-auto mb-6 text-[#C5A059]" />
                <h3 className="text-xl font-bold uppercase tracking-widest mb-2">DermaBot is thinking...</h3>
                <p className="text-gray-500 text-xs">Analyzing 50+ parameters</p>
             </div>
           )}

           {/* STEP: RESULTS*/}
           {step === 'results' && (
             <div className="w-full animate-fade-in">
                <div className="text-center mb-12">
                   <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2 block">Analysis Complete</span>
                   <h1 className="text-3xl font-bold mb-2">Your Personal Ritual</h1>
                   <p className="text-sm text-gray-500">Tailored for: <b>{answers.concern}</b></p>
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
                      {routine.am.map((p, i) => (
                         <div key={i} className="flex gap-4 mb-4 border p-3 rounded-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                            <img src={p.image} className="w-16 h-16 object-cover rounded-sm" alt={p.name}/>
                            <div>
                               <p className="text-[10px] font-bold text-gray-400 uppercase">Step {i+1}</p>
                               <h4 className="font-bold text-sm">{p.name}</h4>
                            </div>
                         </div>
                      ))}
                   </div>
                   <div>
                      <h3 className="font-bold text-lg uppercase tracking-widest mb-4 flex items-center gap-2"><Moon size={18}/> Night</h3>
                      {routine.pm.map((p, i) => (
                         <div key={i} className="flex gap-4 mb-4 border p-3 rounded-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                            <img src={p.image} className="w-16 h-16 object-cover rounded-sm" alt={p.name}/>
                            <div>
                               <p className="text-[10px] font-bold text-gray-400 uppercase">Step {i+1}</p>
                               <h4 className="font-bold text-sm">{p.name}</h4>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <button onClick={() => {setStep(1); setView('landing');}} className="w-full mt-12 border border-black py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-colors">Start New Analysis</button>
             </div>
           )}

        </div>
      )}

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