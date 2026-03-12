import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from LocalStorage on start
  useEffect(() => {
    const savedWishlist = localStorage.getItem('alday_wishlist');
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
  }, []);

  // Save wishlist to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('alday_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add or Remove item from wishlist (Toggle)
  const toggleWishlist = (product) => {
    const productId = product._id || product.id; // Support MongoDB _id

    setWishlistItems(prev => {
      const exists = prev.find(item => (item._id || item.id) === productId);
      if (exists) {
        return prev.filter(item => (item._id || item.id) !== productId); // Remove if exists
      }
      return [...prev, product]; // Add if it doesn't exist
    });
  };

  // Helper to check if an item is wishlisted
  const isInWishlist = (id) => {
    return wishlistItems.some(item => (item._id || item.id) === id);
  };

  const getWishlistCount = () => wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      toggleWishlist, 
      isInWishlist, 
      getWishlistCount 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};