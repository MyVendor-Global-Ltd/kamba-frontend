import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'kamba_token';
const USERNAME_KEY = 'kamba_username';
const USER_DATA_KEY = 'kamba_user_data';

const tokenStore = Platform.OS === 'web'
  ? {
      getItemAsync: (key) => AsyncStorage.getItem(key),
      setItemAsync: (key, value) => AsyncStorage.setItem(key, value),
      deleteItemAsync: (key) => AsyncStorage.removeItem(key),
    }
  : SecureStore;

export const storage = {
  async getToken() {
    try {
      return await tokenStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to get token:', e);
      return null;
    }
  },

  async setToken(token) {
    try {
      await tokenStore.setItemAsync(TOKEN_KEY, token);
      return true;
    } catch (e) {
      console.warn('Failed to set token:', e);
      return false;
    }
  },

  async clearToken() {
    try {
      await tokenStore.deleteItemAsync(TOKEN_KEY);
      return true;
    } catch (e) {
      console.warn('Failed to clear token:', e);
      return false;
    }
  },

  async getUsername() {
    try {
      return await AsyncStorage.getItem(USERNAME_KEY);
    } catch (e) {
      console.warn('Failed to get username:', e);
      return null;
    }
  },

  async setUsername(username) {
    try {
      await AsyncStorage.setItem(USERNAME_KEY, username);
      return true;
    } catch (e) {
      console.warn('Failed to set username:', e);
      return false;
    }
  },

  async clearUsername() {
    try {
      await AsyncStorage.removeItem(USERNAME_KEY);
      return true;
    } catch (e) {
      console.warn('Failed to clear username:', e);
      return false;
    }
  },

  async getUserData() {
    try {
      const data = await AsyncStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to get user data:', e);
      return null;
    }
  },

  async setUserData(data) {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Failed to set user data:', e);
      return false;
    }
  },

  async clearAll() {
    await Promise.all([
      this.clearToken(),
      this.clearUsername(),
      AsyncStorage.removeItem(USER_DATA_KEY),
    ]);
  },
};

export default storage;
