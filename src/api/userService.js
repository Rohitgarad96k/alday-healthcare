import API from './axiosInstance';

const userService = {
  // 👥 Get all users (customers) for the admin dashboard
  getAllUsers: async (queryString = '') => {
    const response = await API.get(`/user${queryString}`);
    return response.data;
  },
  
  // 👤 Get a specific user
  getUserById: async (id) => {
    const response = await API.get(`/user/${id}`);
    return response.data;
  }
};

export default userService;