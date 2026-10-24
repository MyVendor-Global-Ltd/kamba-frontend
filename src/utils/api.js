import axios from 'axios';
import { storage } from './storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.kamba.ng/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.clearAll();
      // Navigation will be handled by the app's auth state
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  sendPhoneCode: (data) => api.post('/auth/phone/send', data),
  verifyPhoneCode: (data) => api.post('/auth/phone/verify', data),
  verifyOTP: (data) => api.post('/auth/otp/verify', data),
  resendOTP: (data) => api.post('/auth/otp/resend', data),
};

export const userAPI = {
  checkUsername: (username) => api.get('/user/username/check', { params: { username } }),
  claimUsername: (data) => api.post('/user/username', data),
  updateProfile: (data) => api.put('/user/profile', data),
  getMe: () => api.get('/user/me'),
};

export default api;