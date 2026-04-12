import React, { useState, useEffect } from 'react';
import productService from '../api/productService';
import API from '../api/axiosInstance';
import { UploadCloud, Loader2, X, CheckCircle } from 'lucide-react';

// --- CLOUDINARY UPLOAD WIDGET COMPONENT ---
const CloudinaryUploadWidget = ({ value, onChange, heightClass = "h-32" }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "alday_preset");
    formData.append("cloud_name", "djiksysxg");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/djiksysxg/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.secure_url) {
        onChange(data.secure_url);
      } else {
        alert(`Cloudinary Error: ${data.error?.message || 'Failed to upload'}`);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative w-full ${heightClass} border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white flex items-center justify-center group hover:border-indigo-400 transition-colors`}>
      {isUploading ? (
        <div className="flex flex-col items-center text-indigo-500">
          <Loader2 className="animate-spin mb-2" size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Uploading...</span>
        </div>
      ) : value ? (
        <>
          <img src={value} alt="Preview" className="w-full h-full object-contain p-2" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="text-white text-[10px] uppercase tracking-widest font-bold cursor-pointer px-4 py-2 bg-black/50 rounded-sm hover:bg-black transition-colors">
              Change Image
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </>
      ) : (
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-indigo-500 bg-gray-50 hover:bg-indigo-50 transition-colors">
          <UploadCloud size={24} className="mb-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

// --- CATEGORY MAP ---
const CATEGORY_MAP = {
  "Skincare": {
    subCategories: ["Face Wash", "Face Toner", "Face Serum", "Moisturiser", "Sunscreen"],
    concerns: ["Pigmentation", "Acne", "Ageing", "Sun Protection", "Sensitivity"],
    ingredients: ["Vitamin C", "Salicylic Acid", "Hyaluronic Acid", "Neem", "Rose"]
  },
  "Haircare": {
    subCategories: ["Shampoo", "Conditioner", "Hair Oil", "Hair Serum", "Hair Perfume"],
    concerns: ["Hair Growth", "Hair Fall", "Dandruff", "Dry/Damaged Hair", "Hair Loss"],
    ingredients: ["Rosemary", "Onion", "Coconut", "Argan", "Tea Tree", "Castor"]
  },
  "Bodycare": {
    subCategories: ["Body Wash", "Body Scrub", "Body Lotion", "Body Oil", "Soaps"],
    concerns: ["Body Acne", "Dryness", "Tanning", "Stretch Marks"],
    ingredients: ["Coffee", "Almond", "Shea Butter", "Cocoa", "Lavender"]
  },
  "Gifting": {
    subCategories: [],
    concerns: [],
    ingredients: []
  }
};

const ProductModal = ({ isOpen, onClose, fetchProducts, productToEdit }) => {
  const defaultState = {
    name: '',
    description: '',
    mrp: '',
    price: '',
    category: 'Skincare',
    subCategory: CATEGORY_MAP['Skincare'].subCategories[0],
    concern: CATEGORY_MAP['Skincare'].concerns[0],
    keyIngredient: CATEGORY_MAP['Skincare'].ingredients[0],
    countInStock: '',
    image: '',
    images: [],
    sale: false,
    bestSeller: false,
    isBundle: false 
  };

  const [formData, setFormData] = useState(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      // 🔥 FIX 1: Detect if it's a Bundle by checking the Category Array (Since DB strips `isBundle` flag)
      const isProductBundle = Array.isArray(productToEdit.category) && productToEdit.category.includes("Bundle");

      // Extract the main category (e.g., 'Skincare') ignoring the 'Bundle' tag
      const cat = Array.isArray(productToEdit.category)
        ? (productToEdit.category.find(c => c !== "Bundle") || 'Skincare')
        : (productToEdit.category || 'Skincare');

      const subCat = Array.isArray(productToEdit.category) && !isProductBundle && productToEdit.category.length > 1
        ? productToEdit.category[1]
        : '';

      let ingredient = '';
      if (productToEdit.keyActives && Array.isArray(productToEdit.keyActives) && productToEdit.keyActives.length > 0) {
        const active = productToEdit.keyActives[0];
        ingredient = typeof active === 'object' ? (active.name || active.title || '') : active;
      }

      setFormData({
        ...productToEdit,
        image: productToEdit.image || productToEdit.imageUrl || '',
        images: productToEdit.images || [],
        category: cat,
        subCategory: subCat || (CATEGORY_MAP[cat]?.subCategories[0] || ''),
        concern: productToEdit.concern || (CATEGORY_MAP[cat]?.concerns[0] || ''),
        keyIngredient: ingredient || (CATEGORY_MAP[cat]?.ingredients[0] || ''),
        isBundle: isProductBundle // Toggle automatically flips!
      });
    } else {
      setFormData(defaultState);
    }
    setError('');
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'category') {
      const map = CATEGORY_MAP[value] || { subCategories: [], concerns: [], ingredients: [] };
      setFormData({
        ...formData,
        category: value,
        subCategory: map.subCategories.length > 0 ? map.subCategories[0] : '',
        concern: map.concerns.length > 0 ? map.concerns[0] : '',
        keyIngredient: map.ingredients.length > 0 ? map.ingredients[0] : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleExtraImageChange = (index, url) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData({ ...formData, images: newImages });
  };

  const addExtraImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeExtraImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setError('Main Image is required. Please upload an image.');
      return;
    }

    setIsLoading(true);
    setError('');

    const autoGeneratedId = `PRD-${Date.now()}`;

    // 🔥 DYNAMIC PAYLOAD
    const payload = {
      name: formData.name,
      description: formData.description,
      mrp: parseFloat(formData.mrp),
      price: parseFloat(formData.price),
      countInStock: parseInt(formData.countInStock, 10), // 🔥 FIX 2: Stock count works for both now
      productId: productToEdit ? (productToEdit.productId || autoGeneratedId) : autoGeneratedId,
      category: formData.isBundle 
        ? [formData.category, "Bundle"].filter(Boolean) 
        : [formData.category, formData.subCategory].filter(Boolean),
      keyActives: formData.isBundle 
        ? [{ name: "Multiple Actives" }] 
        : (formData.keyIngredient ? [{ name: formData.keyIngredient }] : []),
      image: formData.image,
      images: [formData.image, ...formData.images].filter(img => img && img.trim() !== ''),
      sale: formData.sale,
      bestSeller: formData.bestSeller
    };

    try {
      if (productToEdit) {
        const idForUrl = productToEdit.productId || productToEdit._id || productToEdit.id;
        await productService.updateProduct(idForUrl, payload);
      } else {
        await productService.createProduct(payload);
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

  const activeMap = CATEGORY_MAP[formData.category] || { subCategories: [], concerns: [], ingredients: [] };
  const noOptions = activeMap.subCategories.length === 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {productToEdit ? 'Edit Formulation' : 'Add New Formulation'}
          </h2>
          
          {/* 🔥 BUNDLE TOGGLE SWITCH */}
          <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl">
            <span className={`text-sm font-bold ${!formData.isBundle ? 'text-slate-900' : 'text-gray-400'}`}>Single Product</span>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, isBundle: !formData.isBundle })}
              className={`w-12 h-6 rounded-full transition-colors relative ${formData.isBundle ? 'bg-[#C5A059]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${formData.isBundle ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
            <span className={`text-sm font-bold ${formData.isBundle ? 'text-[#C5A059]' : 'text-gray-400'}`}>Bundle / Kit</span>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-semibold border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: IMAGES */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Product Image *</label>
                <CloudinaryUploadWidget
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  heightClass="h-48"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Gallery Images (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative">
                      <CloudinaryUploadWidget
                        value={url}
                        onChange={(newUrl) => handleExtraImageChange(index, newUrl)}
                        heightClass="h-24"
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraImageField(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10 shadow-md transition-colors"
                        title="Remove Image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExtraImageField}
                    className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all bg-white"
                  >
                    <span className="text-xl mb-1">+</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-center px-2">Add Image</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: PRODUCT DETAILS */}
            <div className="lg:col-span-2 space-y-5">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {formData.isBundle ? 'Bundle Name *' : 'Product Name *'}
                </label>
                <input
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none bg-gray-50 focus:bg-white transition-colors"
                  placeholder={formData.isBundle ? "e.g. Ultimate Hair Growth Kit" : "e.g. Vitamin C Face Serum"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  name="description" required value={formData.description} onChange={handleChange} rows="3"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Clinical formulation description..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">MRP (₹) *</label>
                  <input
                    type="number" step="0.01" name="mrp" required value={formData.mrp} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Selling Price (₹) *</label>
                  <input
                    type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
                
                {/* 🔥 FIX 2: Stock Count is now ALWAYS visible for both Bundles and Single Products */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Count *</label>
                  <input
                    type="number" name="countInStock" required value={formData.countInStock} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white font-medium">
                    {Object.keys(CATEGORY_MAP).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Hide extra dropdowns if it's a Bundle */}
                {!formData.isBundle && (
                  <>
                    <div>
                      <label className={`block text-sm font-semibold mb-1.5 ${noOptions ? 'text-gray-400' : 'text-gray-700'}`}>
                        Product Type
                      </label>
                      <select name="subCategory" value={formData.subCategory} onChange={handleChange} disabled={noOptions}
                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors">
                        {noOptions ? <option value="">N/A</option> : activeMap.subCategories.map(item => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-1.5 ${noOptions ? 'text-gray-400' : 'text-gray-700'}`}>
                        Primary Concern
                      </label>
                      <select name="concern" value={formData.concern} onChange={handleChange} disabled={noOptions}
                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors">
                        {noOptions ? <option value="">N/A</option> : activeMap.concerns.map(item => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-1.5 ${noOptions ? 'text-gray-400' : 'text-gray-700'}`}>
                        Key Ingredient
                      </label>
                      <select name="keyIngredient" value={formData.keyIngredient} onChange={handleChange} disabled={noOptions}
                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors">
                        {noOptions ? <option value="">N/A</option> : activeMap.ingredients.map(item => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 py-2 bg-yellow-50/50 p-4 border border-yellow-100 rounded-xl">
                <input
                  type="checkbox" id="sale" name="sale"
                  checked={formData.sale} onChange={handleChange}
                  className="w-5 h-5 text-slate-900 rounded focus:ring-slate-900 cursor-pointer"
                />
                <label htmlFor="sale" className="text-sm font-bold text-gray-700 cursor-pointer">
                  Mark as "On Sale" (Shows sale badge on storefront)
                </label>
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-bold transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md font-bold transition-all flex items-center gap-2">
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Saving...' : (productToEdit ? 'Update Details' : `Publish ${formData.isBundle ? 'Bundle' : 'Product'}`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;