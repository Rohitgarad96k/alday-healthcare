import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Update this base URL if your swagger docs show a different path
  const API_BASE_URL = 'https://aldey-backend.vercel.app/api/auth'; 

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
      // --- THE FIX: Format the data exactly how the backend wants it ---
      const formattedData = {
        fullName: userData.name, // We change 'name' to 'fullName' here!
        email: userData.email,
        phone: userData.phone,
        password: userData.password
        // We leave out confirmPassword because the backend doesn't need it
      };

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData), // Send the formatted data
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after registration
        if (data.token) {
           setUser(data.user);
           localStorage.setItem('alday_active_user', JSON.stringify(data.user));
           localStorage.setItem('alday_auth_token', data.token);
        }
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: data.message || 'Registration failed. Please check your details.' };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  };

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user details and authentication token
        setUser(data.user);
        localStorage.setItem('alday_active_user', JSON.stringify(data.user));
        localStorage.setItem('alday_auth_token', data.token); 
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: data.message || 'Invalid email or password.' };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('alday_active_user');
    localStorage.removeItem('alday_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};