import api from './api';
import { Donation, ApiResponse, PaginatedResponse } from '../types';

export interface CreateDonationData {
  donatorName: string;
  email: string;
  phone?: string;
  amount: number;
  type: 'one-time' | 'monthly' | 'yearly';
  category: string;
  purpose?: string;
  paymentMethod: string;
  isAnonymous: boolean;
}

export const donationsService = {
  async create(data: CreateDonationData): Promise<ApiResponse<Donation>> {
    const response = await api.post('/donations', data);
    return response.data;
  },

  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<PaginatedResponse<Donation>> {
    const response = await api.get('/donations', { params });
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Donation>> {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<CreateDonationData>
  ): Promise<ApiResponse<Donation>> {
    const response = await api.put(`/donations/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/donations/${id}`);
    return response.data;
  },

  // Get user's own donations
  async getUserDonations(): Promise<ApiResponse<{ donations: Donation[] }>> {
    const response = await api.get('/donations/user/me');
    return response.data;
  },
};
