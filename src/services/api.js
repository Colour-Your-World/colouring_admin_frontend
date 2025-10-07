const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    
    // Don't set Content-Type for FormData - let browser set it with boundary
    // headers['Content-Type'] = 'multipart/form-data';
    
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

  async getUsers() {
    return this.request('/auth/admin/users');
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

  async uploadBookFile(bookId, file) {
    const formData = new FormData();
    formData.append('file', file);

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
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
