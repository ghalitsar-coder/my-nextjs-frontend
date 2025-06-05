import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Product API functions
export const productApi = {
  // Get all products
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get product by ID
  getById: async (id: string | number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get available products only
  getAvailable: async () => {
    // Since our Hono route gets all products, we'll filter on frontend
    const response = await api.get('/products');
    const products = response.data;
    return Array.isArray(products) ? products.filter((p: any) => p.isAvailable !== false) : [];
  },

  // Create new product
  create: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  update: async (id: string | number, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  delete: async (id: string | number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Search products
  search: async (query: string) => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}&type=products`);
    return response.data;
  },
};

// User API functions
export const userApi = {
  // Get all users
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID
  getById: async (id: string | number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Get users by role
  getByRole: async (role: string) => {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },

  // Create new user
  create: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user role
  updateRole: async (id: string | number, roleData: any) => {
    const response = await api.put(`/users/${id}/role`, roleData);
    return response.data;
  },

  // Check user role
  checkRole: async (id: string | number) => {
    const response = await api.get(`/users/${id}/check-role`);
    return response.data;
  },
};

// Order API functions
export const orderApi = {
  // Get all orders
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Create new order
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};

// Cart API functions
export const cartApi = {
  // Get user cart
  get: async (userId: string | number) => {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  },

  // Add item to cart
  addItem: async (userId: string | number, itemData: any) => {
    const response = await api.post(`/cart/${userId}/add`, itemData);
    return response.data;
  },
};

// Statistics API functions
export const statsApi = {
  // Get application statistics
  get: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Export the axios instance for custom requests
export default api;
