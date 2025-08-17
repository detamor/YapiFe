import api from './api';

export interface UserFilters {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  search?: string;
}

export interface UserStats {
  overview: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
    recentRegistrations: number;
  };
  statusBreakdown: Array<{ _id: string; count: number }>;
  roleBreakdown: Array<{ _id: string; count: number }>;
}

export interface RoleUpgradeData {
  role: string;
  reason: string;
}

export const usersService = {
  // Get all users with filters
  getAll: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.role) params.append('role', filters.role);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  // Get user statistics
  getStats: async (): Promise<{ success: boolean; data: UserStats }> => {
    const response = await api.get('/users/stats/overview');
    return response.data;
  },

  // Upgrade user role
  upgradeRole: async (userId: string, role: string, reason: string) => {
    const response = await api.put(`/users/${userId}/role`, {
      role,
      reason,
    });
    return response.data;
  },

  // Get user role history
  getRoleHistory: async (userId: string) => {
    const response = await api.get(`/users/${userId}/role-history`);
    return response.data;
  },

  // Get user by ID
  getById: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user status
  updateStatus: async (userId: string, status: string, reason?: string) => {
    const response = await api.put(`/users/${userId}/status`, {
      status,
      reason,
    });
    return response.data;
  },
};

