import API from './axiosInstance';

const productService = {
  // 📦 Get all products (accepts optional query strings like '?limit=1000')
  getAllProducts: async (queryString = '') => {
    const response = await API.get(`/product${queryString}`);
    return response.data;
  },

  // 🔍 Get a single product by its ID
  getProductById: async (id) => {
    const response = await API.get(`/product/${id}`);
    return response.data;
  },

  // ➕ Create a new product
  createProduct: async (productData) => {
    const response = await API.post('/product', productData);
    return response.data;
  },

  // ✏️ Update an existing product
  updateProduct: async (id, productData) => {
    const response = await API.put(`/product/${id}`, productData);
    return response.data;
  },

  // ❌ Delete a product
  deleteProduct: async (id) => {
    const response = await API.delete(`/product/${id}`);
    return response.data;
  }
};

export default productService;