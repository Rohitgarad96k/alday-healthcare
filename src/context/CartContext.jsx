import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const API_BASE_URL = 'https://aldey-backend.vercel.app/api/cart';

  // Helper to get the auth token
  const getToken = () => localStorage.getItem('alday_auth_token');

  // Load Cart from Backend (if logged in) OR Local Storage (if guest)
  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await fetch(API_BASE_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            // Assuming backend returns { data: { items: [...] } } or similar
            // Adjust this path if your backend nests the items differently!
            const fetchedItems = data.items || data.data?.items || data.cart?.items; 
            if (fetchedItems && fetchedItems.length > 0) {
              setCartItems(fetchedItems);
              return; // Exit if we successfully loaded from the backend
            }
          }
        } catch (error) {
          console.error("Failed to load cart from server", error);
        }
      }
      
      // Fallback to local storage
      const savedCart = localStorage.getItem('alday_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    };

    fetchCart();
  }, []);

  // Save to Local Storage as a backup whenever cart changes
  useEffect(() => {
    localStorage.setItem('alday_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id; // Handle MongoDB IDs

    // 1. Optimistic UI Update (Instant feedback)
    setCartItems(prev => {
      const existing = prev.find(item => (item._id || item.id) === productId);
      if (existing) {
        return prev.map(item => 
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);

    // 2. Server Sync
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/add`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ productId, quantity })
        });
      } catch (error) {
        console.error("Failed to sync add to cart with server", error);
      }
    }
  };

  const removeFromCart = async (id) => {
    // 1. Optimistic UI Update
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));

    // 2. Server Sync
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/remove/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to sync remove from cart with server", error);
      }
    }
  };

  const updateQuantity = async (id, delta) => {
    // 1. Optimistic UI Update
    let newQuantity = 1;
    setCartItems(prev => prev.map(item => {
      if ((item._id || item.id) === id) {
        newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));

    // 2. Server Sync
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/update`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          // Some backends expect 'quantity' to be the delta, others expect the absolute new quantity. 
          // Adjust this if your backend expects `{ productId, delta }` instead!
          body: JSON.stringify({ productId: id, quantity: newQuantity }) 
        });
      } catch (error) {
        console.error("Failed to sync update quantity with server", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/clear`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to clear cart on server", error);
      }
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getCartTotal, 
      getCartCount,
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};