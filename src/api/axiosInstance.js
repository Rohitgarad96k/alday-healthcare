import axios from 'axios';

// Dynamically use the local URL during development, and Vercel in production
const API_URL = import.meta.env.VITE_API_URL || 'https://aldey-backend.vercel.app/api';

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
  const isAdminPanel = window.location.pathname.startsWith('/admin');
  const token = isAdminPanel ? adminToken : (userToken || adminToken);
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Global Security Firewall & Auto-Retry
API.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // 🔥 FIX 1: AUTO-RETRY FOR "COLD STARTS"
    // If it's a network error or a Vercel 504 Timeout, try again silently!
    if (originalRequest && (!error.response || error.response.status >= 500)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // We will try up to 2 extra times
      if (originalRequest._retryCount <= 2) {
         console.warn(`Server waking up... Retrying request (${originalRequest._retryCount}/2)`);
         
         // Wait 1.5 seconds to give Vercel and MongoDB time to boot up
         await new Promise(resolve => setTimeout(resolve, 1500));
         
         // Fire the request again automatically!
         return API(originalRequest);
      }
    }

    // 🔥 FIX 2: SECURITY LOGOUT (401/403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const hadUserToken = localStorage.getItem('alday_auth_token');
      const hadAdminToken = localStorage.getItem('adminToken');
      
      if (hadUserToken || hadAdminToken) {
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
    }
    return Promise.reject(error);
  }
);

export default API;