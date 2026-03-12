import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { login } = useAuth(); 
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from || '/';

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Call the backend via context
    const response = await login(email, password);
    
    setIsLoading(false);

    if (response.success) {
      navigate(from, { replace: true }); 
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex min-h-[600px] relative">
        <div className="absolute top-4 right-4 z-20">
          <Link to="/" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"><X size={16} /></Link>
        </div>

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#2B4C3B] to-[#12221A] p-12 flex-col justify-between text-white relative overflow-hidden">
             <div className="relative z-10 animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-2 tracking-tight">Welcome Back</h2>
            </div>
            <div className="relative z-10">
              <Link to="/" className="text-5xl font-bold tracking-widest text-white flex items-end">ALDAY<span className="font-light">HEALTH</span><span className="text-[#C5A059] text-7xl leading-[0.5] ml-1">.</span></Link>
            </div>
            <div className="relative z-10 flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm w-max border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><ShieldCheck size={20} className="text-white" /></div>
              <div><h4 className="font-bold text-sm tracking-wide">100% Natural Nutrition</h4></div>
            </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-10">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2B4C3B]"><User size={24} /></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Log in</h2>
            </div>

            {/* Error Message */}
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-bold mb-4 text-center border border-red-100">{error}</div>}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" placeholder="your@email.com" required className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2B4C3B]"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#2B4C3B]"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white py-3.5 rounded-md font-bold text-sm mt-4 transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2B4C3B] hover:bg-[#1A2E24]'}`}
              >
                 {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" state={{ from }} className="text-[#2B4C3B] font-bold hover:underline">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;