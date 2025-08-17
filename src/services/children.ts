import api from './api';
import { Child, ApiResponse, PaginatedResponse } from '../types';

export interface CreateChildData {
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  story: string;
  currentStatus: {
    living: string;
    health: string;
    education: string;
  };
  skills?: string[];
  achievements?: Array<{
    title: string;
    date: string;
    description: string;
    category?: string;
  }>;
  isPublic: boolean;
  images?: string[];
}

export interface UpdateChildData extends Partial<CreateChildData> {}

export const childrenService = {
  // Get all children (public data for donatur, full data for admin)
  async getAll(params?: {
    page?: number;
    limit?: number;
    gender?: string;
    educationLevel?: string;
    isPublic?: boolean;
  }): Promise<PaginatedResponse<Child>> {
    const response = await api.get('/children', { params });
    return response.data;
  },

  // Get child by ID
  async getById(id: string): Promise<ApiResponse<Child>> {
    const response = await api.get(`/children/${id}`);
    return response.data;
  },

  // Create new child (admin only)
  async create(data: CreateChildData): Promise<ApiResponse<Child>> {
    const response = await api.post('/children', data);
    return response.data;
  },

  // Update child (admin only)
  async update(id: string, data: UpdateChildData): Promise<ApiResponse<Child>> {
    const response = await api.put(`/children/${id}`, data);
    return response.data;
  },

  // Delete child (admin only)
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/children/${id}`);
    return response.data;
  },

  // Get children statistics (admin only)
  async getStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/children/stats/overview');
    return response.data;
  },

  // Update child status
  async updateStatus(id: string, status: string): Promise<ApiResponse<Child>> {
    const response = await api.put(`/children/${id}/status`, { status });
    return response.data;
  },
};
