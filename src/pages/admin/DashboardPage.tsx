import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../../services/reports';
import DashboardStats from '../../components/admin/DashboardStats';

const DashboardPage: React.FC = () => {
  // Query dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: reportsService.getDashboard,
    staleTime: 5 * 60 * 1000,
  });

  // Query donations report (for categories breakdown)
  const { data: donationsReportData, isLoading: isDonationsLoading } = useQuery({
    queryKey: ['donations-report'],
    queryFn: reportsService.getDonationsReport,
    staleTime: 5 * 60 * 1000,
  });

  const adminMenus = [
    {
      title: 'Kelola Anak-anak',
      description: 'Tambah, edit, dan kelola data anak-anak YAPI',
      icon: '👶',
      link: '/admin/children',
      color: 'bg-teal hover:bg-teal-light',
    },
    {
      title: 'Kelola Kegiatan',
      description: 'Buat dan kelola kegiatan serta program',
      icon: '🎯',
      link: '/admin/activities',
      color: 'bg-teal hover:bg-teal-light',
    },
    {
      title: 'Kelola Donasi',
      description: 'Lihat dan verifikasi donasi masuk',
      icon: '💰',
      link: '/admin/donations',
      color: 'bg-amber text-ink hover:bg-amber-dark',
    },
    {
      title: 'Moderasi Testimoni',
      description: 'Approve atau reject testimoni dari pengunjung',
      icon: '💬',
      link: '/admin/testimonials',
      color: 'bg-teal-light hover:bg-teal',
    },
    {
      title: 'Laporan & Statistik',
      description: 'Lihat laporan detail dan analisis data',
      icon: '📊',
      link: '/admin/reports',
      color: 'bg-teal hover:bg-teal-light',
    },
    {
      title: 'Manajemen User',
      description: 'Kelola user, role, dan permissions',
      icon: '👥',
      link: '/admin/users',
      color: 'bg-teal-light hover:bg-teal',
    },
    {
      title: 'Manajemen Sponsorship',
      description: 'Kelola penugasan donatur dan anak asuh secara manual',
      icon: '🤝',
      link: '/admin/sponsorship',
      color: 'bg-teal hover:bg-teal-light',
    },
    {
      title: 'Pengaturan Sistem',
      description: 'Kelola pengaturan website dan user',
      icon: '⚙️',
      link: '/admin/settings',
      color: 'bg-teal-light hover:bg-teal',
    },
  ];

  // Process dynamic monthly donation chart data
  const monthlyStats = dashboardData?.data?.statistics?.monthly || [];
  const maxAmount = Math.max(...monthlyStats.map((m) => m.totalAmount || 0), 1000000);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];

  // Process dynamic categories pie chart data
  const categoryBreakdown = donationsReportData?.data?.categoryBreakdown || [];
  const totalCategoryAmount = categoryBreakdown.reduce(
    (sum: number, cat: any) => sum + cat.totalAmount,
    0
  );

  let currentOffset = 0;
  const colorPalette = [
    '#1B3B36', // Brand Teal
    '#2C534C', // Brand Teal Light
    '#E8A33D', // Brand Amber
    '#B97A1F', // Brand Amber Dark
    '#52564F', // Ink Soft
    '#6B8F71', // Sage
  ];

  const circleItems = categoryBreakdown.map((cat: any, idx: number) => {
    const percentage =
      totalCategoryAmount > 0
        ? Math.round((cat.totalAmount / totalCategoryAmount) * 100)
        : 0;
    const strokeDasharray = `${percentage} 100`;
    const strokeDashoffset = -currentOffset;
    currentOffset += percentage;

    return {
      category: cat._id || 'Lainnya',
      amount: cat.totalAmount,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      color: colorPalette[idx % colorPalette.length],
    };
  });

  // Process dynamic recent activity log
  const recentChildren = dashboardData?.data?.recent?.children || [];
  const recentDonations = dashboardData?.data?.recent?.donations || [];
  const recentUsers = dashboardData?.data?.recent?.users || [];

  const activities = [
    ...recentChildren.map((c) => ({
      id: `child-${c._id}`,
      text: `Anak baru ditambahkan: ${c.name || 'Tanpa Nama'}`,
      time: c.createdAt ? new Date(c.createdAt) : new Date(),
      color: 'bg-blue-500',
    })),
    ...recentDonations.map((d) => ({
      id: `donation-${d._id}`,
      text: `Donasi ${d.category || 'Umum'} baru diterima - Rp ${(d.amount || 0).toLocaleString('id-ID')}`,
      time: d.createdAt ? new Date(d.createdAt) : new Date(),
      color: 'bg-green-500',
    })),
    ...recentUsers.map((u) => ({
      id: `user-${u._id}`,
      text: `User baru terdaftar: ${u.name || 'Tanpa Nama'} (${
        u.role === 'admin' ? 'Admin' : u.role === 'donatur' ? 'Donatur' : 'Relawan'
      })`,
      time: u.createdAt ? new Date(u.createdAt) : new Date(),
      color: 'bg-purple-500',
    })),
  ];

  // Sort activities by time descending
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());

  // Get relative time text helper
  const getRelativeTimeText = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  const isLoading = isDashboardLoading || isDonationsLoading;

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
              <span className="text-xl mr-2">📈</span> Tren Donasi Bulanan (Terbaru)
            </h3>
            <div className="h-64 w-full flex items-end justify-between px-2 pt-4 border-b border-l border-gray-200">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : monthlyStats.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Belum ada data donasi
                </div>
              ) : (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 500 200"
                  preserveAspectRatio="none"
                >
                  {/* Y-Axis Gridlines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" />

                  {monthlyStats.map((item: any, i: number) => {
                    const barWidth = 30;
                    const gap = 35;
                    const startX = 40;
                    const x = startX + i * (barWidth + gap);
                    const barHeight = ((item.totalAmount || 0) / maxAmount) * 140;
                    const y = 180 - barHeight;
                    const label = item._id && typeof item._id === 'object' && item._id.month
                      ? monthNames[item._id.month - 1] || `${item._id.month}`
                      : `${item._id || 'N/A'}`;

                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="3"
                          fill="#1B3B36"
                          className="transition-all duration-500 hover:fill-amber"
                        />
                        <text
                          x={x + barWidth / 2}
                          y="195"
                          fill="#9ca3af"
                          fontSize="11"
                          textAnchor="middle"
                        >
                          {label}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          fill="#4b5563"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                           Rp {((item.totalAmount || 0) / 1000000).toFixed(1)}jt
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Chart 2: Kategori Donasi */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-xl mr-2">🍰</span> Distribusi Kategori Bantuan
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-around h-64">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : circleItems.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Belum ada data distribusi bantuan
                </div>
              ) : (
                <>
                  <div className="relative w-40 h-40">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      {circleItems.map((item: any, i: number) => (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth="4.2"
                          strokeDasharray={item.strokeDasharray}
                          strokeDashoffset={item.strokeDashoffset}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        Total
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        Rp {(totalCategoryAmount / 1000000).toFixed(1)}jt
                      </span>
                    </div>
                  </div>

                  {/* Legends */}
                  <div className="space-y-2 mt-4 md:mt-0 text-sm max-h-60 overflow-y-auto pr-2">
                    {circleItems.map((item: any, i: number) => (
                      <div key={i} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-600 font-medium">
                          {item.category}: {item.percentage}% (Rp{' '}
                          {(item.amount / 1000000).toFixed(1)}jt)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/children"
              className="bg-teal text-white px-4 py-2 rounded-md hover:bg-teal-light transition-colors text-center text-sm font-medium"
            >
              + Tambah Anak Baru
            </Link>
            <Link
              to="/admin/activities"
              className="bg-teal-light text-white px-4 py-2 rounded-md hover:bg-teal transition-colors text-center text-sm font-medium"
            >
              + Buat Kegiatan
            </Link>
            <Link
              to="/admin/donations"
              className="bg-amber text-ink px-4 py-2 rounded-md hover:bg-amber-dark transition-colors text-center text-sm font-medium"
            >
              Verifikasi Donasi
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="py-4 text-center text-gray-400 text-sm animate-pulse">
                Memuat aktivitas terbaru...
              </div>
            ) : activities.length === 0 ? (
              <div className="py-4 text-center text-gray-400 text-sm">
                Belum ada aktivitas terekam
              </div>
            ) : (
              activities.slice(0, 10).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100/80 rounded-md transition-colors"
                >
                  <div
                    className={`w-2.5 h-2.5 ${activity.color} rounded-full mr-3 flex-shrink-0`}
                  ></div>
                  <span className="text-sm text-gray-600 font-medium">
                    {activity.text}
                  </span>
                  <span className="ml-auto text-xs text-gray-400 font-sans pl-2 flex-shrink-0">
                    {getRelativeTimeText(activity.time)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
