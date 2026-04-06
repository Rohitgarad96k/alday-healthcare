import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // 1. LAZY INITIALIZER: Prevents overwriting on refresh
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('alday_wishlist');
      if (savedWishlist) {
        return JSON.parse(savedWishlist);
      }
      return [];
    } catch (error) {
      console.error("Error reading localStorage", error);
      return [];
    }
  });

  // 2. Save to localStorage when wishlistItems changes
  useEffect(() => {
    try {
      localStorage.setItem('alday_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const productId = product._id || product.id || product.productId;

    setWishlistItems((prevItems) => {
      const isExisting = prevItems.find((item) => (item._id || item.id || item.productId) === productId);
      
      if (isExisting) {
        return prevItems.filter((item) => (item._id || item.id || item.productId) !== productId);
      } else {
        return [...prevItems, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id || item.productId) === productId);
  };

  // 🔥 FIX: Added the missing function that the Navbar is looking for!
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  return (
    // 🔥 FIX: Exported getWishlistCount here so the Navbar can use it
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, getWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};