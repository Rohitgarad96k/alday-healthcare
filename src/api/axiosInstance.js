import axios from 'axios';

const API = axios.create({
  baseURL: 'https://aldey-backend.vercel.app/api',
});

// Automatically attach the Admin Token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;