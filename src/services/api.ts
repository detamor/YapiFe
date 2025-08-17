import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token found, adding Authorization header', {
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
    });
  } else {
    console.log('⚠️ No token found in localStorage');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('access_token');
      console.log('❌ 401 Unauthorized error:', {
        url: error.config?.url,
        method: error.config?.method,
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
        responseData: error.response?.data,
      });

      // Only clear token if it's clearly invalid (too short)
      if (!token || token.length < 50) {
        console.log('🗑️ Clearing invalid token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
