import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulate fetching user data (replace this with real authentication logic)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Fetch user from localStorage
    if (storedUser) {
      setUser(storedUser); // Update the user state
    }
  }, []);

  const login = (userData) => {
    setUser(userData); // Set user data on login
    localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
  };

  const logout = () => {
    setUser(null); // Clear user data on logout
    localStorage.removeItem('user'); // Remove from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
