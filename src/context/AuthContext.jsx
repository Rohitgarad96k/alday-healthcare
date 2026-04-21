import React, { createContext, useContext, useState } from 'react';
import authService from '../api/authService'; 
import API from '../api/axiosInstance'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(() => {
    try {
      const loggedInUser = localStorage.getItem('alday_active_user');
      const token = localStorage.getItem('alday_auth_token');

      // Trust the storage 100% if it exists
      if (loggedInUser && token) {
        return JSON.parse(loggedInUser);
      }
    } catch (error) {
      console.error("Error restoring session:", error);
    }
    return null; 
  });

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      const token = response.token || response.data?.token || response.data?.data?.token;
      const userData = response.user || response.data?.user || response.data?.data?.user || { email };

      if (!token) return { success: false, message: 'Invalid server response: No token received.' };

      // Save to State
      setUser(userData);
      
      // Save permanently to Browser Storage
      localStorage.setItem('alday_active_user', JSON.stringify(userData));
      localStorage.setItem('alday_auth_token', token); 

      return { success: true, message: 'Login successful!' };
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, message: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const formattedData = {
        fullName: userData.name, 
        email: userData.email,
        phone: userData.phone,
        password: userData.password
      };

      const response = await authService.register(formattedData);

      const token = response.token || response.data?.token || response.data?.data?.token;
      const userObj = response.user || response.data?.user || response.data?.data?.user || { email: formattedData.email };

      if (token) {
         setUser(userObj);
         localStorage.setItem('alday_active_user', JSON.stringify(userObj));
         localStorage.setItem('alday_auth_token', token);
      }
      return { success: true, message: 'Registration successful!' };
      
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg = error.response?.data?.message || 'Server connection error. Please try again later.';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    // The ONLY way a user is logged out now is if this function is triggered manually!
    localStorage.removeItem('alday_auth_token');
    localStorage.removeItem('alday_active_user'); 
    localStorage.removeItem('alday_cart');
    localStorage.removeItem('alday_wishlist');
    
    setUser(null);
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};