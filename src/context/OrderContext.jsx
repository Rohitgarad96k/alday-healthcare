import React, { createContext, useContext, useState, useEffect } from 'react';
import orderService from '../api/orderService'; // Using your existing order service

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Assuming your orderService has a method like this
      const data = await orderService.getAllOrders(); 
      const fetchedOrders = data.data || data.orders || data || [];
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
      setError('');
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError('Failed to load orders. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, setOrders, isLoading, error, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};