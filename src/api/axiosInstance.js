import axios from 'axios';

// Dynamically use the local URL during development, and Vercel in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Secure Tokens to every request
API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('alday_auth_token');
  
  // Prioritize admin token if we are hitting an admin route
  const token = req.url.startsWith('/admin') ? adminToken : (userToken || adminToken);
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Global Security Firewall (401/403)
API.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Session expired or unauthorized. Logging out to protect user data.");
      
      // Clear all tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('alday_active_user');
      localStorage.removeItem('alday_auth_token');
      
      // Redirect to the correct login page
      if (window.location.pathname.startsWith('/admin')) {
         window.location.href = '/admin/login';
      } else {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;