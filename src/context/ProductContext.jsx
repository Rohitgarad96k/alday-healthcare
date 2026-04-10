import React, { createContext, useContext, useState, useEffect } from 'react';
import productService from '../api/productService'; 

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // We define fetchProducts here so it can be called from anywhere
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
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

  // Fetch only ONCE when the provider mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, isLoading, error, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};