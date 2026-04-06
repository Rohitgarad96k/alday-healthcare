import API from './axiosInstance';

const orderService = {
  // 📦 Get all orders for the admin dashboard
  getAllOrders: async (queryString = '') => {
    // Added the leading '/' to ensure it appends correctly to your baseURL
    const response = await API.get(`/admin/order${queryString}`); 
    return response.data;
  },

  // ✏️ Update an order's status
  updateOrderStatus: async (id, status) => {
    // Changed from /order to /admin/order
    const response = await API.patch(`/admin/order/${id}/status`, { status });
    return response.data;
  },
  
  // 🔍 Get a single order's details
  getOrderById: async (id) => {
    // Changed from /order to /admin/order
    const response = await API.get(`/admin/order/${id}`);
    return response.data;
  }
};

export default orderService;