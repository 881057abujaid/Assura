import api from '../../../lib/axios';
import { storage } from '../../../lib/storage';

/**
 * Authentication service handling API requests.
 * Decouples network communications from React components.
 */
export const authService = {
  /**
   * Logs in a user with credentials.
   * @param {Object} credentials - The login credentials.
   * @param {string} credentials.email - User email.
   * @param {string} credentials.password - User password.
   * @returns {Promise<Object>} The API response data containing token and user info.
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Retrieves the current user's profile.
   * @returns {Promise<Object>} The user profile data.
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logs out the user globally.
   * @returns {Promise<void>}
   */
  logout: async () => {
    // If backend has session blacklisting, we hit the logout endpoint
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Backend logout failed or not implemented:', err.message);
    } finally {
      // Always clear local session tokens
      storage.clearAuth();
    }
  }
};

export default authService;
