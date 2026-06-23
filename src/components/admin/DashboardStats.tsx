import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../../services/reports';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const DashboardStats: React.FC = () => {
  // Test backend connection
  useEffect(() => {
    const testBackend = async () => {
      try {
        console.log('🔍 Testing backend connection...');
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        console.log('✅ Backend health check:', data);
      } catch (error) {
        console.error('❌ Backend connection failed:', error);
      }
    };

    // Debug localStorage
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    console.log('🔑 LocalStorage Debug:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
      hasUser: !!user,
      userData: user ? JSON.parse(user) : null,
    });

    testBackend();
  }, []);

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: reportsService.getDashboard,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    enabled: false,
    onError: (error: any) => {
      console.log('🚨 Dashboard stats error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    },
    onSuccess: (data) => {
      console.log('✅ Dashboard stats success:', data);
    },
  });

  // Mock data for when API is not available
  const mockData = {
    children: { total: 0, active: 0, inactive: 0 },
    donations: { totalAmount: 0, totalCount: 0, pending: 0 },
    activities: { ongoing: 0, completed: 0, upcoming: 0 },
    testimonials: { approved: 0, pending: 0, total: 0 },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow animate-pulse"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use mock data if API fails
  const data = error ? mockData : dashboardData?.data || mockData;

  // Show demo mode message
  const isDemoMode = error || !dashboardData;

  const stats = [
    {
      name: 'Total Anak',
      value: data.children.total,
      change: '+12%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Donasi',
      value: `Rp ${data.donations.totalAmount.toLocaleString('id-ID')}`,
      change: '+8%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Kegiatan Aktif',
      value: data.activities.ongoing,
      change: '+5%',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Testimoni',
      value: data.testimonials.approved,
      change: '+15%',
      changeType: 'increase',
      icon: ChatBubbleLeftRightIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div>
      {isDemoMode && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Mode Demo</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Menampilkan data contoh karena API tidak tersedia.</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="text-yellow-800 underline hover:text-yellow-900"
                  >
                    Refresh halaman
                  </button>
                  <span className="text-yellow-600">|</span>
                  <button
                    onClick={() => {
                      console.log('🔍 Testing backend connection manually...');
                      fetch('http://localhost:5000/health')
                        .then((res) => res.json())
                        .then((data) => {
                          console.log('✅ Backend is running:', data);
                          alert('Backend berjalan dengan baik!');
                        })
                        .catch((err) => {
                          console.error('❌ Backend connection failed:', err);
                          alert(
                            'Backend tidak dapat diakses. Pastikan server berjalan di port 5000.'
                          );
                        });
                    }}
                    className="text-yellow-800 underline hover:text-yellow-900"
                  >
                    Test koneksi backend
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                dari bulan lalu
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
