import React from 'react';
import { Link } from 'react-router-dom';
import DashboardStats from '../../components/admin/DashboardStats';

const DashboardPage: React.FC = () => {
  const adminMenus = [
    {
      title: 'Kelola Anak-anak',
      description: 'Tambah, edit, dan kelola data anak-anak YAPI',
      icon: '👶',
      link: '/admin/children',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Kelola Kegiatan',
      description: 'Buat dan kelola kegiatan serta program',
      icon: '🎯',
      link: '/admin/activities',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Kelola Donasi',
      description: 'Lihat dan verifikasi donasi masuk',
      icon: '💰',
      link: '/admin/donations',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      title: 'Moderasi Testimoni',
      description: 'Approve atau reject testimoni dari pengunjung',
      icon: '💬',
      link: '/admin/testimonials',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Laporan & Statistik',
      description: 'Lihat laporan detail dan analisis data',
      icon: '📊',
      link: '/admin/reports',
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      title: 'Manajemen User',
      description: 'Kelola user, role, dan permissions',
      icon: '👥',
      link: '/admin/users',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Pengaturan Sistem',
      description: 'Kelola pengaturan website dan user',
      icon: '⚙️',
      link: '/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Admin YAPI Medan
          </h1>
          <p className="mt-2 text-gray-600">
            Kelola semua aspek website dan data YAPI Medan
          </p>
        </div>

        {/* Statistik Overview */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenus.map((menu, index) => (
            <Link
              key={index}
              to={menu.link}
              className={`${menu.color} text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{menu.icon}</span>
                <h3 className="text-xl font-semibold">{menu.title}</h3>
              </div>
              <p className="text-white/90 text-sm">{menu.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/children"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-center"
            >
              + Tambah Anak Baru
            </Link>
            <Link
              to="/admin/activities"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-center"
            >
              + Buat Kegiatan
            </Link>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors">
              Verifikasi Donasi
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">
                Donasi baru dari Ahmad Rizki - Rp 500.000
              </span>
              <span className="ml-auto text-xs text-gray-400">
                2 jam yang lalu
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">
                Anak baru ditambahkan: Siti Nurhaliza
              </span>
              <span className="ml-auto text-xs text-gray-400">
                4 jam yang lalu
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">
                Testimoni baru menunggu moderasi
              </span>
              <span className="ml-auto text-xs text-gray-400">
                6 jam yang lalu
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
