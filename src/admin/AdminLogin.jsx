import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance'; // Importing the central Axios setup

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e  ) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    try {
      // 1. Send the actual credentials to your Vercel backend
      const response = await API.post('/auth/login', {
        email,
        password,
      });

      // 2. Extract the JWT token from the response
      // (Adjust 'response.data.token' if your backend names it differently, e.g., 'accessToken')
      const { token, user } = response.data;

      // 3. Store the secure token in localStorage
      localStorage.setItem('adminToken', token);
      
      // Optional: Store admin info if needed for the header (like their name)
      if (user) {
        localStorage.setItem('adminUser', JSON.stringify(user));
      }

      // 4. Redirect to the Dashboard
      navigate('/admin');
      
    } catch (err) {
      console.error("Login Error:", err);
      // Display the specific error message sent by your backend, or a default one
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid credentials or server error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Alday Admin</h1>
          <p className="text-gray-500 mt-2">Sign in to access the control panel</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-colors"
              placeholder="admin@alday.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition-all ${
              isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;