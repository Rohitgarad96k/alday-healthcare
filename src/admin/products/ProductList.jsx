import React, { useState, useEffect } from 'react';
import ProductModal from '../ProductModal'; 
import API from '../../api/axiosInstance'; 
import { Star } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/product');
      const fetchedProducts = response.data.data || response.data.products || response.data || [];
      
      const productsArray = Array.isArray(fetchedProducts) ? fetchedProducts : [];
      
      // 🚀 THE FIX: Load permanent stars from LocalStorage
      const savedBestsellers = JSON.parse(localStorage.getItem('permanentBestsellers') || '[]');
      
      // Override the backend's data with our saved stars
      const productsWithPermanentStars = productsArray.map(p => ({
        ...p,
        bestSeller: savedBestsellers.includes(p._id || p.id) ? true : p.bestSeller
      }));

      setProducts(productsWithPermanentStars); 
      setError('');
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError('Failed to load products. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/product/${id}`);
        setProducts(products.filter(product => (product._id || product.id) !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  // 🚀 THE FIX: Save the toggled star permanently to LocalStorage
  const toggleBestseller = (product) => {
    const productId = product._id || product.id;
    if (!productId) return; 

    const newStatus = !product.bestSeller; 

    // 1. Update the UI instantly
    setProducts(products.map(p => 
      (p._id || p.id) === productId ? { ...p, bestSeller: newStatus } : p
    ));
    
    // 2. Save it permanently to the browser
    let savedBestsellers = JSON.parse(localStorage.getItem('permanentBestsellers') || '[]');
    if (newStatus) {
      // Add to saved list if it's not already there
      if (!savedBestsellers.includes(productId)) savedBestsellers.push(productId);
    } else {
      // Remove from saved list
      savedBestsellers = savedBestsellers.filter(id => id !== productId);
    }
    localStorage.setItem('permanentBestsellers', JSON.stringify(savedBestsellers));
  };

  const handleOpenModal = (product = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Database</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-md font-medium"
        >
          + Add New Product
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500 font-medium animate-pulse">Loading products from server...</div>
      ) : error ? (
        <div className="py-4 px-4 bg-red-50 text-red-600 rounded-lg text-center font-medium">{error}</div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No products found. Click "Add New Product" to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-center">Bestseller</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Category</th>
                <th className="p-4 font-semibold text-gray-600">Price</th>
                <th className="p-4 font-semibold text-gray-600">Stock</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const inStock = product.countInStock > 0;

                return (
                  <tr key={product._id || product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleBestseller(product)}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          product.bestSeller 
                            ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                            : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-50'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${product.bestSeller ? 'fill-yellow-500' : ''}`} />
                      </button>
                    </td>

                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                    <td className="p-4 text-gray-600">{product.category}</td>
                    <td className="p-4 text-gray-600">₹{parseFloat(product.price || 0).toFixed(2)}</td>
                    <td className="p-4 text-gray-600 font-medium">{product.countInStock}</td>
                    
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {inStock ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDelete(product._id || product.id)} className="text-red-600 hover:text-red-800 font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        fetchProducts={fetchProducts} 
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default ProductList;