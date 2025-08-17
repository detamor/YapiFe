import api from './api';
import { ApiResponse } from '../types';

export interface DashboardData {
  children: {
    total: number;
    active: number;
    inactive: number;
  };
  donations: {
    totalAmount: number;
    totalCount: number;
    pending: number;
    completed: number;
  };
  activities: {
    ongoing: number;
    completed: number;
    cancelled: number;
  };
  testimonials: {
    approved: number;
    pending: number;
    rejected: number;
  };
}

export const reportsService = {
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    const response = await api.get('/reports/dashboard');
    return response.data;
  }
};





