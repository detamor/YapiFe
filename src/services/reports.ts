import api from './api';
import { ApiResponse } from '../types';

export interface DashboardData {
  overview: {
    totalUsers: number;
    totalChildren: number;
    totalDonations: number;
    totalActivities: number;
    totalTestimonials: number;
  };
  recent: {
    users: any[];
    donations: any[];
    children: any[];
  };
  statistics: {
    roles: Array<{ _id: string; count: number }>;
    status: Array<{ _id: string; count: number }>;
    donations: {
      totalAmount: number;
      avgAmount: number;
      count: number;
    };
    monthly: Array<{
      _id: { year: number; month: number };
      totalAmount: number;
      count: number;
    }>;
  };
}

export interface PublicStats {
  totalChildren: number;
  totalDonors: number;
  totalActivities: number;
  yearsOfService: number;
}

export const reportsService = {
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  async getPublicStats(): Promise<ApiResponse<PublicStats>> {
    const response = await api.get('/reports/public-stats');
    return response.data;
  },

  async getUsersReport(): Promise<ApiResponse<any>> {
    const response = await api.get('/reports/users');
    return response.data;
  },

  async getDonationsReport(): Promise<ApiResponse<any>> {
    const response = await api.get('/reports/donations');
    return response.data;
  },

  async getChildrenReport(): Promise<ApiResponse<any>> {
    const response = await api.get('/reports/children');
    return response.data;
  },

  async getActivitiesReport(): Promise<ApiResponse<any>> {
    const response = await api.get('/reports/activities');
    return response.data;
  }
};
