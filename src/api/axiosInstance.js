import axios from 'axios';

const API = axios.create({
  baseURL: 'https://aldey-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Tokens
API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('alday_auth_token');
  
  const token = adminToken || userToken;
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Global 401/403 Handling
API.interceptors.response.use(
  (response) => response, 
  (error) => {
    // If the server says the token is invalid or expired
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Backend rejected the request (401/403). Auto-logout is temporarily disabled for testing.");
      
      // --- TEMPORARILY COMMENTED OUT TO PREVENT REDIRECT LOOPS ---
      /*
      localStorage.removeItem('adminToken');
      localStorage.removeItem('alday_active_user');
      localStorage.removeItem('alday_auth_token');
      
      if (window.location.pathname.startsWith('/admin')) {
         window.location.href = '/admin/login';
      } else {
         window.location.href = '/login';
      }
      */
    }
    return Promise.reject(error);
  }
);

export default API;