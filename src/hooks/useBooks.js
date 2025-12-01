import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useBooks = (params = {}) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    count: 0,
  });

  const fetchBooks = async (newParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = { ...params, ...newParams };
      const response = await apiService.getBooks(queryParams);
      
      if (response.success) {
        setBooks(response.data.books);
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
          count: response.count || 0,
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const createBook = async (bookData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.createBook(bookData);
      
      if (response.success) {
        // Refresh the books list
        await fetchBooks();
        return { success: true, data: response.data.book };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error creating book:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBookFile = async (bookId, files) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.uploadBookFile(bookId, files);
      
      if (response.success) {
        // Refresh the books list
        await fetchBooks();
        return { success: true, data: response.data };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error uploading book file:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const addPage = async (bookId, pageNumber, pageImage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.addPage(bookId, pageNumber, pageImage);
      
      if (response.success) {
        // Refresh the books list
        await fetchBooks();
        return { success: true, data: response.data };
      }
    } catch (err) {
      setError(err.message);
      console.error('Error adding page:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    books,
    isLoading,
    error,
    pagination,
    fetchBooks,
    createBook,
    uploadBookFile,
    addPage,
  };
};
