import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const usePlans = (params = {}) => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = async (newParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = { ...params, ...newParams };
      const response = await apiService.getPlans(queryParams);
      
      if (response.success) {
        setPlans(response.data.plans);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const createPlan = async (planData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.createPlan(planData);
      
      if (response.success) {
        // Refresh the plans list
        await fetchPlans();
        return { success: true, data: response.data.plan };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error creating plan:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (planId, planData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.updatePlan(planId, planData);
      
      if (response.success) {
        // Refresh the plans list
        await fetchPlans();
        return { success: true, data: response.data.plan };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating plan:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlan = async (planId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.deletePlan(planId);
      
      if (response.success) {
        // Refresh the plans list
        await fetchPlans();
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting plan:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
};

