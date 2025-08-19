import axios from 'axios';
import { AuthTokenManager } from '../utils/secureStorage';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Enable cookies for CSRF protection
});

api.interceptors.request.use((config) => {
  const tokenManager = AuthTokenManager.getInstance();
  const token = tokenManager.getAuthToken();

  if (token && tokenManager.isTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Secure token found, adding Authorization header', {
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
    });
  } else {
    console.log('⚠️ No valid token found in secure storage');
    // Remove invalid token
    if (token) {
      tokenManager.removeAuthToken();
    }
  }

  // Add CSRF token if available
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const tokenManager = AuthTokenManager.getInstance();

    if (error.response?.status === 401) {
      const token = tokenManager.getAuthToken();
      console.log('❌ 401 Unauthorized error:', {
        url: error.config?.url,
        method: error.config?.method,
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
        responseData: error.response?.data,
      });

      // Clear invalid token and redirect to login
      if (token) {
        console.log('🗑️ Clearing invalid token from secure storage');
        tokenManager.removeAuthToken();

        // Redirect to login page
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }

    // Handle other security-related errors
    if (error.response?.status === 403) {
      console.log('🚫 403 Forbidden - Access denied');
    }

    if (error.response?.status === 429) {
      console.log('⏰ 429 Too Many Requests - Rate limited');
    }

    return Promise.reject(error);
  }
);

export default api;
