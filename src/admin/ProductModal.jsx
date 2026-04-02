import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance'; 

const ProductModal = ({ isOpen, onClose, fetchProducts, productToEdit }) => {
  // ✅ FIXED: Changed 'stock' to 'countInStock'
  const defaultState = {
    name: '',
    description: '',
    mrp: '',
    price: '',
    category: 'Skincare',
    concern: 'Skin Brightening',
    countInStock: '', 
    image: '',
    sale: false,
    bestSeller: false
  };

  const [formData, setFormData] = useState(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData(defaultState);
    }
    setError('');
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // ✅ FIXED: Parse countInStock instead of stock
    const payload = {
      ...formData,
      mrp: parseFloat(formData.mrp),
      price: parseFloat(formData.price),
      countInStock: parseInt(formData.countInStock, 10),
    };

    try {
      if (productToEdit) {
        const productId = productToEdit._id || productToEdit.id; 
        await API.put(`/product/${productId}`, payload);
      } else {
        await API.post('/product', payload);
      }
      
      fetchProducts();
      onClose();
    } catch (err) {
      console.error("Product Save Error:", err);
      setError(err.response?.data?.message || 'Failed to save product. Check backend requirements.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {productToEdit ? 'Edit Formulation' : 'Add New Formulation'}
        </h2>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-semibold border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
              <input
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="Vitamin C Serum"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
              <input
                type="url" name="image" required value={formData.image} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description" required value={formData.description} onChange={handleChange} rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none"
              placeholder="Clinical formulation details..."
            />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">MRP (₹)</label>
              <input
                type="number" step="0.01" name="mrp" required value={formData.mrp} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="599"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Selling Price (₹)</label>
              <input
                type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="499"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Available Stock</label>
              {/* ✅ FIXED: Input now uses name="countInStock" */}
              <input
                type="number" name="countInStock" required value={formData.countInStock} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="50"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none">
                <option value="Skincare">Skincare</option>
                <option value="Haircare">Haircare</option>
                <option value="Supplements">Supplements</option>
                <option value="Body Care">Body Care</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Concern</label>
              <select name="concern" value={formData.concern} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none">
                <option value="Skin Brightening">Skin Brightening</option>
                <option value="Acne Control">Acne Control</option>
                <option value="Hair Fall">Hair Fall</option>
                <option value="Dandruff">Dandruff</option>
                <option value="Immunity">Immunity</option>
              </select>
            </div>
          </div>

          {/* Row 5: Sale Checkbox */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox" id="sale" name="sale"
              checked={formData.sale} onChange={handleChange}
              className="w-5 h-5 text-slate-900 rounded focus:ring-slate-900 cursor-pointer"
            />
            <label htmlFor="sale" className="text-sm font-bold text-gray-700 cursor-pointer">
              Mark as "On Sale" (Shows sale badge on storefront)
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-bold transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md font-bold transition-all">
              {isLoading ? 'Saving...' : (productToEdit ? 'Update Details' : 'Publish Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;