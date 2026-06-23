import React from 'react';
import { Link } from 'react-router-dom';
import DashboardStats from '../../components/admin/DashboardStats';

const DashboardPage: React.FC = () => {
  const adminMenus = [
    {
      title: 'Kelola Anak-anak',
      description: 'Tambah, edit, dan kelola data anak-anak YAPI',
      icon: '📊',
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

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-slide-up">
          {/* Chart 1: Tren Donasi */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-xl mr-2">📈</span> Tren Donasi Bulanan (2026)
            </h3>
            <div className="h-64 w-full flex items-end justify-between px-2 pt-4 border-b border-l border-gray-200">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Y-Axis Gridlines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                
                {/* Bar 1: Jan */}
                <rect x="30" y="80" width="35" height="120" rx="3" fill="#6366f1" className="transition-all duration-500 hover:fill-indigo-700" />
                <text x="47.5" y="195" fill="#9ca3af" fontSize="11" textAnchor="middle">Jan</text>
                <text x="47.5" y="70" fill="#4b5563" fontSize="10" fontWeight="bold" textAnchor="middle">12jt</text>

                {/* Bar 2: Feb */}
                <rect x="110" y="60" width="35" height="140" rx="3" fill="#6366f1" className="transition-all duration-500 hover:fill-indigo-700" />
                <text x="127.5" y="195" fill="#9ca3af" fontSize="11" textAnchor="middle">Feb</text>
                <text x="127.5" y="50" fill="#4b5563" fontSize="10" fontWeight="bold" textAnchor="middle">15jt</text>

                {/* Bar 3: Mar */}
                <rect x="190" y="100" width="35" height="100" rx="3" fill="#6366f1" className="transition-all duration-500 hover:fill-indigo-700" />
                <text x="207.5" y="195" fill="#9ca3af" fontSize="11" textAnchor="middle">Mar</text>
                <text x="207.5" y="90" fill="#4b5563" fontSize="10" fontWeight="bold" textAnchor="middle">10jt</text>

                {/* Bar 4: Apr */}
                <rect x="270" y="40" width="35" height="160" rx="3" fill="#6366f1" className="transition-all duration-500 hover:fill-indigo-700" />
                <text x="287.5" y="195" fill="#9ca3af" fontSize="11" textAnchor="middle">Apr</text>
                <text x="287.5" y="30" fill="#4b5563" fontSize="10" fontWeight="bold" textAnchor="middle">18jt</text>

                {/* Bar 5: Mei */}
                <rect x="350" y="50" width="35" height="150" rx="3" fill="#6366f1" className="transition-all duration-500 hover:fill-indigo-700" />
                <text x="367.5" y="195" fill="#9ca3af" fontSize="11" textAnchor="middle">Mei</text>
                <text x="367.5" y="40" fill="#4b5563" fontSize="10" fontWeight="bold" textAnchor="middle">16jt</text>

                {/* Bar 6: Jun */}
                <rect x="430" y="20" width="35" height="180" rx="3" fill="#4f46e5" className="transition-all duration-500 hover:fill-indigo-700" />
                <text x="447.5" y="195" fill="#9ca3af" fontSize="11" textAnchor="middle">Jun</text>
                <text x="447.5" y="10" fill="#4f46e5" fontSize="10" fontWeight="bold" textAnchor="middle">22jt</text>
              </svg>
            </div>
          </div>

          {/* Chart 2: Kategori Donasi */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-xl mr-2">🍰</span> Distribusi Kategori Bantuan
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-around h-64">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Pendidikan (45%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#4f46e5" strokeWidth="4.2" strokeDasharray="45 100" strokeDashoffset="0" />
                  {/* Kesehatan (25%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.2" strokeDasharray="25 100" strokeDashoffset="-45" />
                  {/* Nutrisi (15%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="15 100" strokeDashoffset="-70" />
                  {/* Lainnya (15%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#6b7280" strokeWidth="4.2" strokeDasharray="15 100" strokeDashoffset="-85" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total</span>
                  <span className="text-sm font-bold text-gray-800">93 jt Rp</span>
                </div>
              </div>
              
              {/* Legends */}
              <div className="space-y-2 mt-4 md:mt-0 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-gray-600 font-medium">Pendidikan: 45% (Rp 41,8M)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 font-medium">Kesehatan: 25% (Rp 23,2M)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 font-medium">Nutrisi: 15% (Rp 14M)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 font-medium">Lainnya: 15% (Rp 14M)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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
