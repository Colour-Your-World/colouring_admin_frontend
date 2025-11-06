import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start and fetch user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        apiService.setToken(token);
        try {
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('accessToken');
            apiService.setToken(null);
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
          localStorage.removeItem('accessToken');
          apiService.setToken(null);
        }
      }
      
      setIsLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(email, password);
      
      if (response.success) {
        const { user: userData, tokens } = response.data;
        
        // Store only token
        apiService.setToken(tokens.accessToken);
        localStorage.setItem('accessToken', tokens.accessToken);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend to update user status (isOnline: false, lastLogout)
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear all stored data
      apiService.setToken(null);
      localStorage.clear(); // Clear all localStorage items
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const deleteAccount = async () => {
    try {
      // Delete the current user's account
      const response = await apiService.deleteAccount();
      
      if (response.success) {
        // Clear all stored data after successful deletion
        apiService.setToken(null);
        localStorage.clear();
        
        setUser(null);
        setIsAuthenticated(false);
        
        return { success: true, message: 'Account deleted successfully' };
      }
      
      return { success: false, error: 'Failed to delete account' };
    } catch (error) {
      console.error('Delete account error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    deleteAccount,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
