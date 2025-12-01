const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('accessToken');   
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Get multipart headers for file uploads
  getMultipartHeaders() {
    const headers = {};
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Authentication APIs
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(userData) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async deleteAccount() {
    return this.request('/auth/me', {
      method: 'DELETE',
    });
  }

  // User APIs
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/auth/users?${queryString}` : '/auth/users';
    return this.request(endpoint);
  }

  async getUser(userId) {
    return this.request(`/auth/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.request(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/auth/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    const url = `${this.baseURL}/auth/upload-profile-photo`;
    const config = {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload profile photo');
    }

    return data;
  }

  // Book APIs
  async getBooks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    return this.request(endpoint);
  }

  async getBook(bookId) {
    return this.request(`/books/${bookId}`);
  }

  async deleteBook(bookId) {
    return this.request(`/books/${bookId}`, {
      method: 'DELETE',
    });
  }

  async updateBook(bookId, bookData) {
    const jsonPayload = {
      name: bookData.name,
      description: bookData.description,
      type: bookData.type,
      price: bookData.price,
      isActive: bookData.isActive
    };
    
    return this.request(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(jsonPayload),
    });
  }

  async createBook(bookData) {
    // Create JSON payload (no file)
    const jsonPayload = {
      name: bookData.name,
      description: bookData.description,
      type: bookData.type,
      price: bookData.price
    };
    
    const url = `${this.baseURL}/books`;
    const config = {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(jsonPayload),
    };
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create book');
    }

    return data;
  }

  async uploadBookFile(bookId, files) {
    const formData = new FormData();

    // Support single file, FileList, or array of files
    if (Array.isArray(files)) {
      files.forEach((file) => {
        if (file) formData.append('files', file);
      });
    } else if (files && typeof files.length === 'number') {
      Array.from(files).forEach((file) => {
        if (file) formData.append('files', file);
      });
    } else if (files) {
      formData.append('files', files);
    }

    const url = `${this.baseURL}/books/${bookId}/upload`;
    const config = {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    };

    const response = await fetch(url, config);
    
    let data;
    try {
      data = await response.json();
    } catch (error) {
      const textResponse = await response.text();
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      throw new Error(data.message || `Upload failed with status ${response.status}`);
    }

    return data;
  }
  
  async addPage(bookId, pageNumber, pageImage) {
    // Try FormData approach first (most likely to work for file uploads)
    return this.addPageFormData(bookId, pageNumber, pageImage);
  }

  async addPageFormData(bookId, pageNumber, pageImage) {
    const formData = new FormData();
    
    // Based on server code, use exact field names expected
    formData.append('pageNumber', pageNumber.toString());
    formData.append('pageImage', pageImage);


    const url = `${this.baseURL}/books/${bookId}/pages`;
    const config = {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    };


    const response = await fetch(url, config);
    
    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const textResponse = await response.text();
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to add page');
    }

    return data;
  }

  async deletePage(bookId, pageNumber) {
    return this.request(`/books/${bookId}/pages/${pageNumber}`, {
      method: 'DELETE',
    });
  }

  // Plan APIs
  async getPlans(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/plans?${queryString}` : '/plans';
    return this.request(endpoint);
  }

  async getPlan(planId) {
    return this.request(`/plans/${planId}`);
  }

  async createPlan(planData) {
    return this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updatePlan(planId, planData) {
    return this.request(`/plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  }

  async deletePlan(planId) {
    return this.request(`/plans/${planId}`, {
      method: 'DELETE',
    });
  }

  // Subscription APIs
  async getAllSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/payments/subscriptions/all?${queryString}` : '/payments/subscriptions/all';
    return this.request(endpoint);
  }

  async cancelSubscription(userId, reason = null) {
    const body = { userId };
    if (reason) {
      body.reason = reason;
    }
    return this.request('/payments/subscription/cancel', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Payment History APIs
  async getPaymentHistory(userId = null) {
    const endpoint = userId ? `/payments/history?userId=${userId}` : '/payments/history';
    return this.request(endpoint);
  }

  async getAllPaymentHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/payments/all?${queryString}` : '/payments/all';
    return this.request(endpoint);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
