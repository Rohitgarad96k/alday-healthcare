import API from './axiosInstance';

const authService = {
  // 🔐 Login a user or admin
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // 📝 Register a new customer
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // 👤 Get current user profile (if needed later)
  getProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  }
};

export default authService;