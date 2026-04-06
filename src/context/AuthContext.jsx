import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const loggedInUser = localStorage.getItem('alday_active_user');
    const token = localStorage.getItem('alday_auth_token');
    
    if (loggedInUser && token) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

 // 1. Register Function
  const register = async (userData) => {
    try {
      const formattedData = {
        fullName: userData.name, 
        email: userData.email,
        phone: userData.phone,
        password: userData.password
      };

      const data = await authService.register(formattedData);

      // Auto-login after registration
      if (data.token) {
         setUser(data.user);
         localStorage.setItem('alday_active_user', JSON.stringify(data.user));
         localStorage.setItem('alday_auth_token', data.token);
      }
      return { success: true, message: 'Registration successful!' };
      
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg = error.response?.data?.message || 'Server connection error. Please try again later.';
      return { success: false, message: errorMsg };
    }
  };

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });

      // Save user details and authentication token
      setUser(data.user);
      localStorage.setItem('alday_active_user', JSON.stringify(data.user));
      localStorage.setItem('alday_auth_token', data.token); 
      return { success: true, message: 'Login successful!' };
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, message: errorMsg };
    }
  };

  // 3. Logout Function (🔥 100% ENTERPRISE STRICT)
  const logout = () => {
    // 1. Clear Authentication Data
    localStorage.removeItem('alday_auth_token');
    localStorage.removeItem('alday_active_user'); 
    
    // 2. Clear Personal Shopping Data (Prevents next user from seeing previous cart/wishlist)
    localStorage.removeItem('alday_cart');
    localStorage.removeItem('alday_wishlist');

    // 3. Clear the React user state
    setUser(null);

    // 4. Force a hard refresh to wipe React's memory completely
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};