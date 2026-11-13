import axios from 'axios';
import { Platform } from 'react-native';
import { storage } from './storage';

const configuredBaseUrl = (process.env.EXPO_PUBLIC_API_URL || 'https://api.kamba.ng').replace(/\/+$/, '');
const API_BASE_URL = configuredBaseUrl.endsWith('/api/v1')
  ? configuredBaseUrl
  : configuredBaseUrl.endsWith('/v1')
    ? `${configuredBaseUrl.slice(0, -3)}/api/v1`
    : configuredBaseUrl.endsWith('/api')
      ? `${configuredBaseUrl}/v1`
      : `${configuredBaseUrl}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (Platform.OS !== 'web') {
    const cookies = await storage.getAuthCookies();
    const cookieHeader = Object.entries(cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
    if (cookieHeader) {
      config.headers = config.headers || {};
      config.headers.Cookie = cookieHeader;
    }
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  async (response) => {
    if (Platform.OS !== 'web') {
      const setCookieHeader = response.headers?.['set-cookie'];
      const setCookieHeaders = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : typeof setCookieHeader === 'string'
          ? [setCookieHeader]
          : [];
      const cookieUpdates = {};

      setCookieHeaders.forEach((header) => {
        const cookiePattern = /(?:^|,\s*)(access_token|refresh_token)=([^;,\s]*)/g;
        let match;
        while ((match = cookiePattern.exec(header)) !== null) {
          cookieUpdates[match[1]] = /(?:^|;)\s*Max-Age=0(?:;|$)/i.test(header) ? null : match[2];
        }
      });

      if (Object.keys(cookieUpdates).length > 0) {
        await storage.setAuthCookies(cookieUpdates);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = /\/auth\/(login(?:\/phone(?:\/verify)?)?|register(?:\/phone)?|verify\/phone|refresh|logout|otp\/|forgot-password|reset-password)/.test(
      originalRequest?.url || ''
    );

    if (error.response?.status !== 401 || !originalRequest || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh').finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
        await storage.clearAll();
      }
      return Promise.reject(refreshError);
    }
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  registerPhone: (data) => api.post('/auth/register/phone', data),
  login: (data) => api.post('/auth/login', data),
  loginPhone: (data) => api.post('/auth/login/phone', data),
  verifyPhone: (data) => api.post('/auth/verify/phone', data),
  verifyPhoneLogin: (data) => api.post('/auth/login/phone/verify', data),
  setUsername: (data) => api.post('/auth/username/set', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getDashboard: () => api.get('/auth/dashboard'),
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  requestOTP: (data) => api.post('/auth/otp/request', data),
  verifyOTP: (data) => api.post('/auth/otp/verify', data),
  resendOTP: (data) => api.post('/auth/otp/resend', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const userAPI = {
  async checkUsername(username) {
    try {
      const response = await api.get('/auth/username-availability', {
        params: { username },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return error.response.data;
      }
      throw error;
    }
  },
  async upgradeToVendor() {
    const response = await api.post('/auth/upgrade-to-vendor');
    return response.data;
  },
};

export const vendorAPI = {
  async listStores(params = {}) {
    const response = await api.get('/vendors/stores', { params });
    const stores = response.data?.stores;
    if (!Array.isArray(stores)) {
      throw new Error('The store catalog response was not in the expected format.');
    }
    return stores;
  },
  async getStore(slug) {
    const response = await api.get(`/vendors/stores/${encodeURIComponent(slug)}`);
    return response.data?.store || null;
  },
};

export const productAPI = {
  async listProducts(params = {}) {
    const response = await api.get('/api/products', { params });
    const products = response.data?.products;
    if (!Array.isArray(products)) {
      throw new Error('Product list was not in the expected format.');
    }
    return products;
  },
  async getProduct(productId) {
    const response = await api.get(`/api/products/${productId}`);
    return response.data?.product || null;
  },
};

export const cartAPI = {
  async getCart() {
    const response = await api.get('/api/cart');
    return response.data?.cart || { items: [], subtotal: 0, total: 0 };
  },
  async addItem(productId, quantity = 1) {
    const response = await api.post('/api/cart/items', { productId, quantity });
    return response.data?.cart || { items: [], subtotal: 0, total: 0 };
  },
  async updateItem(productId, quantity) {
    const response = await api.put(`/api/cart/items/${productId}`, { quantity });
    return response.data?.cart || { items: [], subtotal: 0, total: 0 };
  },
  async removeItem(productId) {
    const response = await api.delete(`/api/cart/items/${productId}`);
    return response.data?.cart || { items: [], subtotal: 0, total: 0 };
  },
};

export const orderAPI = {
  async createOrder(cartItems, vendorId) {
    const response = await api.post('/api/checkout', { cartItems, vendorId });
    return response.data?.order || null;
  },
  async listOrders() {
    const response = await api.get('/api/orders');
    return response.data?.orders || [];
  },
  async getOrder(orderId) {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data?.order || null;
  },
  async cancelOrder(orderId) {
    const response = await api.post(`/api/orders/${orderId}/cancel`);
    return response.data?.order || null;
  },
  async confirmDelivery(orderId) {
    const response = await api.post(`/api/orders/${orderId}/delivery/confirm`);
    return response.data?.order || null;
  },
  async createDispute(orderId) {
    const response = await api.post(`/api/orders/${orderId}/disputes`);
    return response.data?.dispute || null;
  },
  async getDispute(disputeId) {
    const response = await api.get(`/api/disputes/${disputeId}`);
    return response.data?.dispute || null;
  },
};

export const vendorAPI = {
  async listProducts() {
    const response = await api.get('/api/vendor/products');
    return response.data?.products || [];
  },
  async createProduct(productData) {
    const response = await api.post('/api/vendor/products', productData);
    return response.data?.product || null;
  },
  async updateProduct(productId, updates) {
    const response = await api.patch(`/api/vendor/products/${productId}`, updates);
    return response.data?.product || null;
  },
  async deleteProduct(productId) {
    const response = await api.delete(`/api/vendor/products/${productId}`);
    return response.data?.success !== false;
  },
  async listOrders() {
    const response = await api.get('/api/vendor/orders');
    return response.data?.orders || [];
  },
  async updateOrderStatus(orderId, status) {
    const response = await api.patch(`/api/vendor/orders/${orderId}`, { status });
    return response.data?.order || null;
  },
  async getPayments() {
    const response = await api.get('/api/vendor/payments');
    return response.data?.payments || [];
  },
};

export default api;
