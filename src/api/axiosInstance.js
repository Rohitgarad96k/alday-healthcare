import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://aldey-backend.vercel.app/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Secure Tokens to every request dynamically
API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('alday_auth_token');
  
  // Prioritize admin token if we are hitting an admin route
  const isAdminPanel = window.location.pathname.startsWith('/admin');
  const token = isAdminPanel ? adminToken : (userToken || adminToken);
  
  if (token) {
    // Inject token freshly on every single request
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

    // AUTO-RETRY FOR "COLD STARTS" (Vercel 500/504 Errors)
    if (originalRequest && (!error.response || error.response.status >= 500)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount <= 2) {
         console.warn(`Server waking up... Retrying request (${originalRequest._retryCount}/2)`);
         await new Promise(resolve => setTimeout(resolve, 1500));
         return API(originalRequest);
      }
    }

    // If the backend returns a 401, the app will just ignore it and KEEP you logged in.
    // You will only be logged out when you physically click the "Logout" button.
    if (error.response && error.response.status === 401) {
        console.error(`Backend returned 401 Unauthorized for route: ${originalRequest.url}. (Ignored to keep user logged in)`);
    }
    
    return Promise.reject(error);
  }
);

export default API;