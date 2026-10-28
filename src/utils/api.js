import axios from 'axios';
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.clearAll();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
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
};

export default api;
