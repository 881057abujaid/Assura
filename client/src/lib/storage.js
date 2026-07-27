/**
 * LocalStorage wrapper module to isolate all browser storage interactions.
 * Helps decouple the application from direct global storage APIs.
 */

const ACCESS_TOKEN_KEY = 'assura_token';
const REFRESH_TOKEN_KEY = 'assura_refresh_token';
const USER_KEY = 'assura_user';

export const storage = {
  // Access Token Helpers
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },
  removeAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // Refresh Token Helpers
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },
  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // User Helpers
  getUser: () => {
    const userString = localStorage.getItem(USER_KEY);
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (e) {
      console.error('Failed to parse user data from storage:', e);
      return null;
    }
  },
  setUser: (user) => {
    if (user) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Failed to stringify and store user data:', e);
      }
    }
  },
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  // Global Session Cleaner
  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export default storage;
