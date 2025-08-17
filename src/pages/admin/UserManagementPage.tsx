import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { usersService } from '../../services/users';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'donatur' | 'volunteer';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  phone: string;
  createdAt: string;
  approvedBy?: {
    name: string;
    email: string;
  };
  activityStats?: {
    totalDonations: number;
    donationCount: number;
    volunteerHours: number;
    lastActivity: string;
  };
}

interface UserStats {
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

const UserManagementPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    role: '',
    search: '',
  });

  const queryClient = useQueryClient();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getAll(filters),
    enabled: true,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => usersService.getStats(),
    enabled: true,
  });

  const upgradeRoleMutation = useMutation({
    mutationFn: (data: { userId: string; role: string; reason: string }) =>
      usersService.upgradeRole(data.userId, data.role, data.reason),
    onSuccess: () => {
      toast.success('Role user berhasil diubah!');
      setShowRoleModal(false);
      setSelectedUser(null);
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['userStats']);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal mengubah role user');
    },
  });

  const handleUpgradeRole = () => {
    if (!selectedUser || !newRole || !reason) {
      toast.error('Semua field harus diisi');
      return;
    }

    upgradeRoleMutation.mutate({
      userId: selectedUser.id,
      role: newRole,
      reason,
    });
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setReason('');
    setShowRoleModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'volunteer':
        return 'bg-blue-100 text-blue-800';
      case 'donatur':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manajemen User
        </h1>
        <p className="text-gray-600">
          Kelola semua user, lihat statistik, dan upgrade role
        </p>
      </div>

      {/* Statistics Cards */}
      {!statsLoading && statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.overview.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.overview.approved}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserPlusIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.overview.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.overview.recentRegistrations}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Cari nama/email..."
            className="input-field"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value, page: 1 })
            }
          />
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            className="input-field"
            value={filters.role}
            onChange={(e) =>
              setFilters({ ...filters, role: e.target.value, page: 1 })
            }
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="donatur">Donatur</option>
            <option value="volunteer">Volunteer</option>
          </select>
          <button className="btn-primary">Filter</button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Daftar User ({usersData?.data?.users?.length || 0})
          </h3>
        </div>

        {usersLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktivitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersData?.data?.users?.map((user: User) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>
                          Donasi: {user.activityStats?.donationCount || 0}
                        </div>
                        <div>
                          Total: Rp{' '}
                          {user.activityStats?.totalDonations?.toLocaleString() ||
                            0}
                        </div>
                        <div>
                          Volunteer: {user.activityStats?.volunteerHours || 0}{' '}
                          jam
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openRoleModal(user)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit Role
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Upgrade Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upgrade Role User
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User
                </label>
                <p className="text-sm text-gray-900">
                  {selectedUser.name} ({selectedUser.email})
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Baru
                </label>
                <select
                  className="input-field w-full"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="donatur">Donatur</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan
                </label>
                <textarea
                  className="input-field w-full"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Berikan alasan untuk perubahan role..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpgradeRole}
                  disabled={upgradeRoleMutation.isPending}
                  className="btn-primary"
                >
                  {upgradeRoleMutation.isPending
                    ? 'Updating...'
                    : 'Update Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
