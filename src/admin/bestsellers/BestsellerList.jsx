import React, { useState, useEffect } from 'react';
// ✅ 1. Import the centralized service instead of raw API
import productService from '../../api/productService';
import { Star } from 'lucide-react';

const BestsellerList = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setIsLoading(true);
        // ✅ 2. Use the service method to fetch products
        const data = await productService.getAllProducts();
        const allProducts = data.data || data.products || data || [];
        
        // Read from the permanent saved stars
        const savedBestsellers = JSON.parse(localStorage.getItem('permanentBestsellers') || '[]');
        
        // Filter ONLY the products whose IDs are in our saved list
        const filteredBestsellers = allProducts.filter(p => 
          savedBestsellers.includes(p._id || p.id) || p.bestSeller === true
        );

        setBestsellers(filteredBestsellers);
      } catch (err) {
        console.error("Failed to fetch bestsellers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Star className="text-yellow-500 fill-yellow-500" /> Bestseller Highlights
      </h1>
      
      {isLoading ? (
        <div className="py-10 text-center text-gray-500 animate-pulse">Loading bestsellers...</div>
      ) : bestsellers.length === 0 ? (
        <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No bestsellers selected yet. Go to the Products tab and click the star icon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <div key={product._id || product.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm z-10">
                <Star className="w-3 h-3 fill-yellow-900" /> Top Ranked
              </div>
              <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center text-gray-400 overflow-hidden relative">
                <img 
                  src={product.image || product.imageUrl || "https://via.placeholder.com/300"} 
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{product.category}</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                <span className="font-bold text-lg text-slate-900">₹{parseFloat(product.price || 0).toFixed(2)}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.countInStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestsellerList;