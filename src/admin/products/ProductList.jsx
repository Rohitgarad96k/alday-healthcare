import React, { useState, useEffect } from 'react';
import ProductModal from '../ProductModal'; 
import productService from '../../api/productService'; 
import { Star, Image as ImageIcon, AlertCircle, Search, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // State for Filtering, Searching, and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, OUT_OF_STOCK, BESTSELLER
  const [sortOption, setSortOption] = useState('NEWEST'); // NEWEST, OLDEST, PRICE_HIGH, PRICE_LOW, NAME_A_Z, NAME_Z_A

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAllProducts();
      const fetchedProducts = data.data || data.products || data || [];
      
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

  const handleDelete = async (product) => {
    const idForUrl = product.productId || product._id || product.id;

    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await productService.deleteProduct(idForUrl);
        setProducts(products.filter(p => (p.productId || p._id || p.id) !== idForUrl));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  const toggleBestseller = async (product) => {
    const idForUrl = product.productId || product._id || product.id;
    if (!idForUrl) return; 

    const newStatus = !product.bestSeller; 
    const previousProducts = [...products];

    // Optimistic UI Update
    setProducts(products.map(p => 
      (p.productId || p._id || p.id) === idForUrl ? { ...p, bestSeller: newStatus } : p
    ));
    
    try {
      const { _id, id, createdAt, updatedAt, __v, ...cleanProduct } = product;

      await productService.updateProduct(idForUrl, {
        ...cleanProduct, 
        bestSeller: newStatus 
      });
    } catch (error) {
      console.error("Failed to update bestseller status:", error);
      alert("Failed to save bestseller status to database. Reverting.");
      setProducts(previousProducts);
    }
  };

  const handleOpenModal = (product = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  // 🔥 FILTER & SORT LOGIC
  const filteredAndSortedProducts = products
    .filter((product) => {
      // 1. Status Filter
      let matchesStatus = true;
      const inStock = product.countInStock > 0;
      
      if (statusFilter === 'ACTIVE') matchesStatus = inStock;
      if (statusFilter === 'OUT_OF_STOCK') matchesStatus = !inStock;
      if (statusFilter === 'BESTSELLER') matchesStatus = !!product.bestSeller;

      // 2. Search Filter (Checks Name and Category)
      const searchString = searchTerm.toLowerCase();
      const productName = (product.name || '').toLowerCase();
      const productCategory = Array.isArray(product.category) 
        ? product.category.join(' ').toLowerCase() 
        : (product.category || '').toLowerCase();
      
      const matchesSearch = searchString === '' || productName.includes(searchString) || productCategory.includes(searchString);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      // 🔥 3. Sorting Logic
      if (sortOption === 'NEWEST') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortOption === 'OLDEST') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortOption === 'PRICE_HIGH') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortOption === 'PRICE_LOW') {
        return (a.price || 0) - (b.price || 0);
      }
      // 🔥 NEW: Alphabetical Sorting
      if (sortOption === 'NAME_A_Z') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortOption === 'NAME_Z_A') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSortOption('NEWEST');
  };

  const statusOptions = [
    { value: 'ALL', label: 'ALL STATUS' },
    { value: 'ACTIVE', label: 'IN STOCK (ACTIVE)' },
    { value: 'OUT_OF_STOCK', label: 'OUT OF STOCK' },
    { value: 'BESTSELLER', label: 'BESTSELLERS ONLY' }
  ];

  const sortOptions = [
    { value: 'NEWEST', label: 'DATE: NEWEST FIRST' },
    { value: 'OLDEST', label: 'DATE: OLDEST FIRST' },
    { value: 'PRICE_HIGH', label: 'PRICE: HIGH TO LOW' },
    { value: 'PRICE_LOW', label: 'PRICE: LOW TO HIGH' },
    // 🔥 NEW: Alphabetical Sorting Options Added
    { value: 'NAME_A_Z', label: 'NAME: A TO Z' },
    { value: 'NAME_Z_A', label: 'NAME: Z TO A' }
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Database</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your inventory and highlight bestsellers.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-[#12221A] text-white px-5 py-2.5 rounded-lg hover:bg-black transition shadow-md font-bold text-sm tracking-wide flex items-center gap-2 flex-shrink-0"
        >
          + Add New Product
        </button>
      </div>

      {/* FILTERS & SORTING BAR */}
      <div className="flex flex-col xl:flex-row gap-4 items-center mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 w-full">
        
        {/* Search Bar */}
        <div className="relative w-full xl:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by Product Name or Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="relative w-full xl:w-52 flex-shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white appearance-none cursor-pointer text-gray-700"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full xl:w-56 flex-shrink-0">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white appearance-none cursor-pointer text-gray-700"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown size={14} />
          </div>
        </div>

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
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-gray-100">
          <Search size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-gray-900 mb-1">No matching products</p>
          <p className="text-sm">Try adjusting your search or filter criteria.</p>
          <button onClick={clearAllFilters} className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 underline">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
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
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredAndSortedProducts.map((product) => {
                const inStock = product.countInStock > 0;
                const uniqueKeyId = product.productId || product._id || product.id;

                return (
                  <tr key={uniqueKeyId} className="hover:bg-gray-50/80 transition-colors">
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
                        <div className="w-10 h-10 rounded bg-white border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-300" />
                          )}
                        </div>
                        <span className="font-bold text-sm text-gray-900 truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {Array.isArray(product.category) 
                        ? product.category.join(', ') 
                        : (product.category || 'Uncategorized')}
                    </td>
                    
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
                        onClick={() => handleDelete(product)} 
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