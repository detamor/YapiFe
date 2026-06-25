import api from './api';
import { ApiResponse, PaginatedResponse, Testimonial } from '../types';

export const testimonialsService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    isFeatured?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Testimonial>> {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  async create(data: {
    author: {
      name: string;
      occupation?: string;
      organization?: string;
    };
    title: string;
    content: string;
    rating: number;
    type: 'donatur' | 'orang-tua' | 'volunteer' | 'partner' | 'alumni' | 'pengunjung';
    isPublic: boolean;
    relatedChild?: string;
    relatedActivity?: string;
  }): Promise<ApiResponse<Testimonial>> {
    const response = await api.post('/testimonials', data);
    return response.data;
  },

  async moderate(
    id: string,
    status: 'approved' | 'rejected',
    moderationNotes?: string
  ): Promise<ApiResponse<Testimonial>> {
    const response = await api.put(`/testimonials/${id}/moderate`, {
      status,
      moderationNotes,
    });
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};
