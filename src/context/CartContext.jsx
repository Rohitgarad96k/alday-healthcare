import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. BULLETPROOF INITIALIZER: Forces an Array even if LocalStorage is corrupted
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('alday_cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : []; // Guarantee it is always an Array
    } catch (error) {
      console.error("Error parsing cart from local storage", error);
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getToken = () => localStorage.getItem('alday_auth_token');

  const getTrueId = (item) => {
    if (!item) return null;
    if (typeof item.productId === 'object') return item.productId._id || item.productId.id;
    return item.productId || item._id || item.id;
  };

  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const { data } = await API.get('/cart');
        const fetchedItems = data.items || data.data?.items || data.cart?.items || data.data || []; 
        
        const safeFetchedItems = Array.isArray(fetchedItems) ? fetchedItems : [];

        const normalizedCart = safeFetchedItems.map(item => {
          const productObj = typeof item.productId === 'object' ? item.productId : 
                             typeof item.product === 'object' ? item.product : null;
          
          if (productObj) {
            return {
              ...productObj,
              _id: getTrueId(productObj),
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
        }
      } catch (error) {
        console.error("Failed to load cart from server", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('alday_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    // SECURITY CHECK: Ensure a real product is passed, not a click event
    if (!product || !product.name) {
      console.error("addToCart Error: Invalid product passed to Cart!", product);
      return; 
    }

    const pId = getTrueId(product);
    console.log("Adding to cart:", product.name, "ID:", pId); // Debugging log

    // Optimistic UI Update with anti-crash array protection
    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find(item => getTrueId(item) === pId);
      
      if (existing) {
        return safePrev.map(item => 
          getTrueId(item) === pId ? { ...item, quantity: Number(item.quantity) + Number(quantity) } : item
        );
      }
      return [...safePrev, { ...product, _id: pId, quantity: Number(quantity) }];
    });
    
    setIsCartOpen(true);

    if (getToken()) {
      try {
        await API.post('/cart/add', { productId: pId, quantity: Number(quantity) });
      } catch (error) {
        console.error("Backend Sync Error: Could not save to database.", error);
      }
    }
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter(item => getTrueId(item) !== id);
    });

    if (getToken()) {
      try {
        await API.delete(`/cart/remove/${id}`);
      } catch (error) {
        console.error("Failed to remove item from backend", error);
      }
    }
  };

  const updateQuantity = async (id, delta) => {
    let newQuantity = 1;
    
    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map(item => {
        const currentId = getTrueId(item);
        if (String(currentId) === String(id)) {
          newQuantity = Math.max(1, Number(item.quantity) + Number(delta));
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });

    if (getToken()) {
      try {
        await API.put('/cart/update', { productId: id, quantity: newQuantity });
      } catch (error) {
        console.error("Failed to sync quantity with backend", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (getToken()) {
      try {
        await API.delete('/cart/clear');
      } catch (error) {
        console.error("Failed to clear cart on backend", error);
      }
    }
  };

  const getCartTotal = () => {
    const safeItems = Array.isArray(cartItems) ? cartItems : [];
    return safeItems.reduce((total, item) => total + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  };
  
  const getCartCount = () => {
    const safeItems = Array.isArray(cartItems) ? cartItems : [];
    return safeItems.reduce((count, item) => count + Number(item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      getCartTotal, getCartCount, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};