import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('alday_active_user');
    const token = localStorage.getItem('alday_auth_token');
    
    if (loggedInUser && token) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const register = async (userData) => {
    try {
      const formattedData = {
        fullName: userData.name, 
        email: userData.email,
        phone: userData.phone,
        password: userData.password
      };

      const data = await authService.register(formattedData);

      if (data.token) {
         setUser(data.user);
         localStorage.setItem('alday_active_user', JSON.stringify(data.user));
         localStorage.setItem('alday_auth_token', data.token);
         
         // 🔥 TELL THE APP A LOGIN HAPPENED!
         window.dispatchEvent(new Event('auth-change'));
      }
      return { success: true, message: 'Registration successful!' };
      
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg = error.response?.data?.message || 'Server connection error. Please try again later.';
      return { success: false, message: errorMsg };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });

      setUser(data.user);
      localStorage.setItem('alday_active_user', JSON.stringify(data.user));
      localStorage.setItem('alday_auth_token', data.token); 
      
      // 🔥 TELL THE APP A LOGIN HAPPENED!
      window.dispatchEvent(new Event('auth-change'));

      return { success: true, message: 'Login successful!' };
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
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