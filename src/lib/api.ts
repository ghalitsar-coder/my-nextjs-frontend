import axios from 'axios';
import { Promotion } from '@/store/cart-store';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPRING_BOOT_URL || 'http://localhost:8080/api',
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

// Category API functions
export const categoryApi = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by ID
  getById: async (id: string | number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  create: async (categoryData: any) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  update: async (id: string | number, categoryData: any) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  delete: async (id: string | number) => {
    const response = await api.delete(`/categories/${id}`);
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

// Order types
export interface Order {
  orderId: number;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
  orderDate: string;
  status: 'PENDING' | 'PREPARED' | 'DELIVERED' | 'CANCELLED';
  orderDetails: OrderDetail[];
  payments: Payment[];
  orderPromotions?: OrderPromotion[];
}

export interface OrderDetail {
  id: number;
  product: {
    productId: number;
    name: string;
    price: number;
    category: {
      name: string;
    };
  };
  quantity: number;
  unitPrice: number;
}

export interface Payment {
  paymentId: number;
  type: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'SETTLEMENT' | 'CAPTURE' | 'DENY' | 'CANCEL' | 'EXPIRE';
  paymentDate: string;
  transactionId?: string;
  paymentMethod?: string;
  bank?: string;
}

export interface OrderPromotion {
  id: number;
  promotion: {
    promotionId: number;
    name: string;
    discountPercentage?: number;
    discountAmount?: number;
  };
}

export interface CreateOrderRequest {
  userId: string;
  items: {
    productId: number;
    quantity: number;
  }[];
  paymentInfo: {
    type: string;
    paymentMethod?: string;
    transactionId?: string;
    bank?: string;
    vaNumber?: string;
  };
}

// Order API functions
export const orderApi = {
  // Get all orders
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get order by ID
  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Get order payment info
  getPayment: async (id: number) => {
    const response = await api.get(`/orders/${id}/payment`);
    return response.data;
  },

  // Get payment summary for all orders
  getPaymentSummary: async () => {
    const response = await api.get('/orders/payment-summary');
    return response.data;
  },

  // Create new order
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Create order with promotions
  createWithPromotions: async (orderData: CreateOrderRequest & { promotionIds: number[] }): Promise<Order> => {
    const response = await api.post('/orders/with-promotions', orderData);
    return response.data;
  },
  // Update payment status
  updatePaymentStatus: async (orderId: number, paymentData: {
    transactionId?: string;
    status?: string;
    fraudStatus?: string;
    bank?: string;
    vaNumber?: string;
  }) => {
    const response = await api.post(`/orders/${orderId}/payment`, paymentData);
    return response.data as { success: boolean; message: string };
  },

  // Get available promotions for order
  getAvailablePromotions: async (orderTotal?: number) => {
    const url = orderTotal 
      ? `/orders/available-promotions?orderTotal=${orderTotal}`
      : '/orders/available-promotions';
    const response = await api.get(url);
    return response.data as Promotion[];
  },

  // Update order status
  updateStatus: async (orderId: number, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
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
    return response.data;  },
};

// Promotion API functions
export const promotionApi = {
  // Get all promotions
  getAll: async () => {
    const response = await api.get('/promotions');
    return response.data;
  },

  // Get active promotions only
  getActive: async () => {
    const response = await api.get('/promotions/active');
    return response.data;
  },

  // Get eligible promotions for a given order total
  getEligible: async (orderTotal?: number) => {
    const url = orderTotal 
      ? `/promotions/eligible?orderTotal=${orderTotal}`
      : '/promotions/eligible';
    const response = await api.get(url);
    return response.data;
  },

  // Get promotion by ID
  getById: async (id: string | number) => {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  },

  // Create new promotion
  create: async (promotionData: {
    name: string;
    description?: string;
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    minimumPurchaseAmount?: number;
    maximumUses?: number;
    promotionType?: string;
    maxDiscountAmount?: number;
  }) => {
    const response = await api.post('/promotions', promotionData);
    return response.data;
  },

  // Update promotion
  update: async (id: string | number, promotionData: any) => {
    const response = await api.put(`/promotions/${id}`, promotionData);
    return response.data;
  },

  // Delete promotion
  delete: async (id: string | number) => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  },

  // Toggle promotion active status
  toggle: async (id: string | number) => {
    const response = await api.patch(`/promotions/${id}/toggle`);
    return response.data;
  },
};

// Order-Promotion API functions
export const orderPromotionApi = {
  // Get all order-promotion relationships
  getAll: async () => {
    const response = await api.get('/order-promotions');
    return response.data;
  },

  // Get order-promotion by ID
  getById: async (id: string | number) => {
    const response = await api.get(`/order-promotions/${id}`);
    return response.data;
  },

  // Get promotions applied to a specific order
  getByOrderId: async (orderId: string | number) => {
    const response = await api.get(`/order-promotions/order/${orderId}`);
    return response.data;
  },

  // Get orders that use a specific promotion
  getByPromotionId: async (promotionId: string | number) => {
    const response = await api.get(`/order-promotions/promotion/${promotionId}`);
    return response.data;
  },

  // Apply promotion to order
  apply: async (orderId: string | number, promotionId: string | number) => {
    const response = await api.post('/order-promotions', {
      orderId,
      promotionId,
    });
    return response.data;
  },

  // Remove promotion from order
  remove: async (id: string | number) => {
    const response = await api.delete(`/order-promotions/${id}`);
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
