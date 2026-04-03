import React, { useState, useEffect } from 'react';
import ProductModal from '../ProductModal'; 
import API from '../../api/axiosInstance'; 
import { Star, Image as ImageIcon, AlertCircle } from 'lucide-react';

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
      
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []); 
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
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await API.delete(`/product/${id}`);
        setProducts(products.filter(product => (product._id || product.id) !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  // 🚀 THE FIX: Real Database Update with Optimistic UI
  const toggleBestseller = async (product) => {
    const productId = product._id || product.id;
    if (!productId) return; 

    const newStatus = !product.bestSeller; 
    const previousProducts = [...products]; // Save state in case we need to roll back

    // 1. Optimistic UI Update (Feels instant to the user)
    setProducts(products.map(p => 
      (p._id || p.id) === productId ? { ...p, bestSeller: newStatus } : p
    ));
    
    // 2. Real API Call to save permanently
    try {
      // Assuming your backend supports updating a product via PUT
      // Adjust the endpoint or payload if your backend uses a different structure
      await API.put(`/product/${productId}`, {
        ...product, // Send existing product data
        bestSeller: newStatus // Override the bestSeller flag
      });
    } catch (error) {
      console.error("Failed to update bestseller status:", error);
      alert("Failed to save bestseller status to database. Reverting.");
      // 3. Rollback if the API call fails
      setProducts(previousProducts);
    }
  };

  const handleOpenModal = (product = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Database</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your inventory and highlight bestsellers.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-[#12221A] text-white px-5 py-2.5 rounded-lg hover:bg-black transition shadow-md font-bold text-sm tracking-wide flex items-center gap-2"
        >
          + Add New Product
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="animate-pulse font-medium">Loading products from server...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-gray-900 mb-1">No products found</p>
          <p className="text-sm">Click "Add New Product" to populate your store.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500 text-center">Highlight</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Product</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Category</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Price</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Stock</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const inStock = product.countInStock > 0;
                const productId = product._id || product.id;

                return (
                  <tr key={productId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleBestseller(product)}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          product.bestSeller 
                            ? 'text-[#C5A059] bg-[#C5A059]/10 hover:bg-[#C5A059]/20' 
                            : 'text-gray-300 hover:text-[#C5A059] hover:bg-gray-50'
                        }`}
                        title={product.bestSeller ? "Remove from Bestsellers" : "Mark as Bestseller"}
                      >
                        <Star className={`w-5 h-5 ${product.bestSeller ? 'fill-[#C5A059]' : ''}`} />
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-300" />
                          )}
                        </div>
                        <span className="font-bold text-sm text-gray-900 truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-gray-600">{product.category || 'Uncategorized'}</td>
                    
                    <td className="p-4 text-sm font-bold text-gray-900">
                      ₹{parseFloat(product.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {product.countInStock || 0}
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${
                        inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {inStock ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-4">
                      <button 
                        onClick={() => handleOpenModal(product)} 
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(productId)} 
                        className="text-sm font-bold text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
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