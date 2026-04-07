import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('alday_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter(item => item && item.name) : []; 
    } catch (error) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const getToken = () => localStorage.getItem('alday_auth_token');

  const getTrueId = (item) => {
    if (!item) return null;
    if (typeof item.productId === 'object' && item.productId) return item.productId._id || item.productId.id;
    return item.productId || item._id || item.id;
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const { data } = await API.get('/cart', getAuthHeaders());

        let fetchedItems = [];
        if (Array.isArray(data)) fetchedItems = data;
        else if (data?.items) fetchedItems = data.items;
        else if (data?.data?.items) fetchedItems = data.data.items;
        else if (data?.cart?.items) fetchedItems = data.cart.items;

        if (fetchedItems.length > 0) {
          let normalized = fetchedItems.map(item => {
            const p = (item.productId && typeof item.productId === 'object') ? item.productId : 
                      (item.product && typeof item.product === 'object') ? item.product : item;
            return { ...p, _id: getTrueId(item), quantity: Number(item.quantity) || 1 };
          });

          const validCart = normalized.filter(item => item && item.name);
          setCartItems(validCart);

        } else {
          // If backend is empty but user had items locally, safely push them up!
          setCartItems(prevLocal => {
            if (prevLocal.length > 0) {
              prevLocal.forEach(item => {
                const payload = {
                  productId: item._id,
                  quantity: item.quantity,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  category: item.category
                };
                API.post('/cart/add', payload, getAuthHeaders()).catch(() => {});
              });
            }
            return prevLocal;
          });
        }
      } catch (error) {
        console.error("Cart sync error:", error);
      }
    };

    fetchCart();
    window.addEventListener('auth-change', fetchCart);
    return () => window.removeEventListener('auth-change', fetchCart);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('alday_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart", error);
    }
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    if (!product || !product.name) return; 
    const pId = getTrueId(product);

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
        // 🔥 FIX: Send full product details to backend
        const payload = {
          productId: pId,
          quantity: Number(quantity),
          name: product.name,
          price: product.price,
          image: product.image || (product.images && product.images[0]) || "",
          category: Array.isArray(product.category) ? product.category[0] : (product.category || "ALDAY")
        };
        await API.post('/cart/add', payload, getAuthHeaders());
      } catch (error) {
        console.error("Backend Sync Error:", error);
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
        await API.delete(`/cart/remove/${id}`, getAuthHeaders());
      } catch (error) {
        console.error("Backend Sync Error:", error);
      }
    }
  };

  const updateQuantity = async (id, delta) => {
    let newQuantity = 1;

    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map(item => {
        if (String(getTrueId(item)) === String(id)) {
          newQuantity = Math.max(1, Number(item.quantity) + Number(delta));
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });

    if (getToken()) {
      try {
        await API.put('/cart/update', { productId: id, quantity: newQuantity }, getAuthHeaders());
      } catch (error) {
        console.error("Backend Sync Error:", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (getToken()) {
      try {
        await API.delete('/cart/clear', getAuthHeaders());
      } catch (error) {
        console.error("Backend Sync Error:", error);
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