import api from './api';
import { User, ApiResponse } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  access_token?: string;
  token_type?: string;
  accessToken?: string;
  authToken?: string;
  userData?: User;
}

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: { name: string; phone?: string; address?: string }): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async changePassword(data: any): Promise<ApiResponse<void>> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  async refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  async googleLogin(idToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/google-login', { idToken });
    return response.data;
  },

  async facebookLogin(accessToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/facebook-login', { accessToken });
    return response.data;
  }
};








