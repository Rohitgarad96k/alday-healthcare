import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance'; // <-- Import your Axios instance

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getToken = () => localStorage.getItem('alday_auth_token');

  // --- BULLETPROOF ID HELPER ---
  const getTrueId = (item) => {
    if (!item) return null;
    if (typeof item.productId === 'object') return item.productId._id || item.productId.id;
    return item.productId || item._id || item.id;
  };

  // Load Cart from Backend OR Local Storage
  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();
      if (token) {
        try {
          const { data } = await API.get('/cart');
          const fetchedItems = data.items || data.data?.items || data.cart?.items || data.data || []; 
          
          const normalizedCart = fetchedItems.map(item => {
            const productObj = typeof item.productId === 'object' ? item.productId : 
                               typeof item.product === 'object' ? item.product : null;
            
            if (productObj) {
              return {
                ...productObj,
                _id: productObj._id || productObj.id,
                quantity: Number(item.quantity) || 1
              };
            }
            return {
              ...item,
              _id: getTrueId(item),
              quantity: Number(item.quantity) || 1
            };
          });

          if (normalizedCart.length > 0) {
            setCartItems(normalizedCart);
            return; 
          }
        } catch (error) {
          console.error("Failed to load cart from server", error);
        }
      }
      
      const savedCart = localStorage.getItem('alday_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    };

    fetchCart();
  }, []);

  // Save to Local Storage as backup
  useEffect(() => {
    localStorage.setItem('alday_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    const pId = getTrueId(product);
    const previousCart = [...cartItems]; // Store for rollback

    // 1. Optimistic UI Update
    setCartItems(prev => {
      const existing = prev.find(item => getTrueId(item) === pId);
      if (existing) {
        return prev.map(item => 
          getTrueId(item) === pId ? { ...item, quantity: Number(item.quantity) + Number(quantity) } : item
        );
      }
      return [...prev, { ...product, _id: pId, quantity: Number(quantity) }];
    });
    
    setIsCartOpen(true);

    // 2. Server Sync
    if (getToken()) {
      try {
        await API.post('/cart/add', { productId: pId, quantity: Number(quantity) });
      } catch (error) {
        console.error("Failed to sync add to cart with server", error);
        setCartItems(previousCart); // ROLLBACK
      }
    }
  };

  const removeFromCart = async (id) => {
    const previousCart = [...cartItems]; // Store for rollback

    setCartItems(prev => prev.filter(item => getTrueId(item) !== id));

    if (getToken()) {
      try {
        await API.delete(`/cart/remove/${id}`);
      } catch (error) {
        console.error("Failed to remove item", error);
        setCartItems(previousCart); // ROLLBACK
      }
    }
  };

  const updateQuantity = async (id, delta) => {
    let newQuantity = 1;
    const previousCart = [...cartItems]; // Store for rollback
    
    // 1. Optimistic UI Update
    setCartItems(prev => prev.map(item => {
      const currentId = getTrueId(item);
      if (String(currentId) === String(id)) {
        newQuantity = Math.max(1, Number(item.quantity) + Number(delta));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));

    // 2. Server Sync
    if (getToken()) {
      try {
        await API.put('/cart/update', { productId: id, quantity: newQuantity });
      } catch (error) {
        console.error("Failed to sync quantity", error);
        setCartItems(previousCart); // ROLLBACK
      }
    }
  };

  const clearCart = async () => {
    const previousCart = [...cartItems]; // Store for rollback
    setCartItems([]);
    
    if (getToken()) {
      try {
        await API.delete('/cart/clear');
      } catch (error) {
        console.error("Failed to clear cart", error);
        setCartItems(previousCart); // ROLLBACK
      }
    }
  };

  // Safe Math Calculations
  const getCartTotal = () => cartItems.reduce((total, item) => total + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  const getCartCount = () => cartItems.reduce((count, item) => count + Number(item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      getCartTotal, getCartCount, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};