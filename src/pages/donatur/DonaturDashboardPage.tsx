import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  HeartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { childrenService } from '../../services/children';
import { donationsService } from '../../services/donations';
import DonationForm from '../../components/donations/DonationForm';

interface Child {
  id: string;
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
}

interface Donation {
  id: string;
  amount: number;
  currency: string;
  type: 'one-time' | 'monthly' | 'yearly';
  category: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const DonaturDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ['children'],
    queryFn: () => childrenService.getAll(),
    enabled: true,
  });

  const { data: donationsData, isLoading: donationsLoading } = useQuery({
    queryKey: ['userDonations'],
    queryFn: () => donationsService.getUserDonations(),
    enabled: true,
  });

  const createDonationMutation = useMutation({
    mutationFn: (data: any) => donationsService.create(data),
    onSuccess: () => {
      toast.success('Donasi berhasil dibuat!');
      setShowDonationForm(false);
      queryClient.invalidateQueries(['userDonations']);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal membuat donasi');
    },
  });

  const handleCreateDonation = (donationData: any) => {
    createDonationMutation.mutate(donationData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Donatur
          </h1>
          <p className="mt-2 text-gray-600">
            Selamat datang, {user?.name}! Kelola donasi dan lihat anak-anak yang
            Anda bantu
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Donasi
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {donationsData?.data?.donations?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Nominal
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    donationsData?.data?.donations?.reduce(
                      (sum: number, d: Donation) =>
                        sum + (d.status === 'approved' ? d.amount : 0),
                      0
                    ) || 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Anak Dibantu
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {childrenData?.data?.children?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Aksi Cepat</h2>
            <button
              onClick={() => setShowDonationForm(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Donasi Baru
            </button>
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Anak-anak yang Membutuhkan Bantuan
            </h3>
            <p className="text-sm text-gray-600">
              Lihat anak-anak yang bisa Anda bantu melalui donasi
            </p>
          </div>

          {childrenLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {childrenData?.data?.children?.map((child: Child) => (
                  <div
                    key={child.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg font-semibold text-blue-600">
                          {child.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {child.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {child.currentStatus.education} -{' '}
                          {child.currentStatus.living}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {child.story}
                    </p>

                    {child.skills && child.skills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Keterampilan:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {child.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setShowDonationForm(true)}
                      className="w-full btn-primary text-sm"
                    >
                      Bantu Sekarang
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Donations History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Riwayat Donasi Anda
            </h3>
            <p className="text-sm text-gray-600">
              Lihat semua donasi yang telah Anda buat
            </p>
          </div>

          {donationsLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nominal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donationsData?.data?.donations?.map((donation: Donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(donation.createdAt).toLocaleDateString(
                          'id-ID'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Buat Donasi Baru
                </h3>
                <button
                  onClick={() => setShowDonationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <DonationForm onSubmit={handleCreateDonation} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonaturDashboardPage;
