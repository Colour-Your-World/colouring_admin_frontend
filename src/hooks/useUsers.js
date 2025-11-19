import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useUsers = (params = {}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    count: 0,
  });

  const fetchUsers = async (newParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = { ...params, ...newParams };
      const response = await apiService.getUsers(queryParams);
      
      if (response.success) {
        setUsers(response.data.users);
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
          count: response.count || 0,
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUser = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getUser(userId);
      
      if (response.success) {
        // Return full response data structure (includes user, subscription, purchasedPlan, etc.)
        return { success: true, data: response.data };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.updateUser(userId, userData);
      
      if (response.success) {
        // Refresh the users list
        await fetchUsers();
        return { success: true, data: response.data.user };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.deleteUser(userId);
      
      if (response.success) {
        // Refresh the users list
        await fetchUsers();
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    pagination,
    fetchUsers,
    getUser,
    updateUser,
    deleteUser,
  };
};
