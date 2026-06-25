import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../../services/reports';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'donations' | 'children' | 'activities' | 'users'>('donations');

  // Fetch report data
  const donationsReport = useQuery({
    queryKey: ['report-donations'],
    queryFn: reportsService.getDonationsReport,
  });

  const childrenReport = useQuery({
    queryKey: ['report-children'],
    queryFn: reportsService.getChildrenReport,
  });

  const activitiesReport = useQuery({
    queryKey: ['report-activities'],
    queryFn: reportsService.getActivitiesReport,
  });

  const usersReport = useQuery({
    queryKey: ['report-users'],
    queryFn: reportsService.getUsersReport,
  });

  const tabs = [
    { id: 'donations', name: 'Laporan Donasi', icon: '💰' },
    { id: 'children', name: 'Data Anak Asuh', icon: '👶' },
    { id: 'activities', name: 'Kegiatan & Program', icon: '📅' },
    { id: 'users', name: 'Pengguna & Peran', icon: '👥' },
  ] as const;

  const renderDonationsTab = () => {
    const { data, isLoading } = donationsReport;
    if (isLoading) return <div className="py-12 text-center text-gray-500">Loading data donasi...</div>;

    const stats = data?.data?.statistics || { totalAmount: 0, avgAmount: 0, count: 0 };
    const categories = data?.data?.categoryBreakdown || [];
    const list = data?.data?.donations || [];

    return (
      <div className="space-y-6">
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Dana Terkumpul</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp {stats.totalAmount.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase">Rata-Rata Donasi</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp {Math.round(stats.avgAmount).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase">Jumlah Transaksi Donasi</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.count} Transaksi</p>
          </div>
        </div>

        {/* Breakdown & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Breakdown Kategori</h3>
            <div className="space-y-4">
              {categories.map((cat: any, i: number) => {
                const pct = stats.totalAmount > 0 ? Math.round((cat.totalAmount / stats.totalAmount) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="capitalize text-gray-700">{cat._id || 'Lainnya'}</span>
                      <span className="text-gray-900">{pct}% (Rp {cat.totalAmount.toLocaleString('id-ID')})</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-teal h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada data kategori.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Transaksi Terbaru</h3>
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Donatur</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Kategori</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Jumlah</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {list.slice(0, 10).map((donation: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {donation.donatur?.name || donation.donaturInfo?.name || 'Anonim'}
                      </td>
                      <td className="px-4 py-3 capitalize text-indigo-600">{donation.category}</td>
                      <td className="px-4 py-3 font-bold text-gray-800">Rp {donation.amount.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 uppercase text-gray-500">{donation.paymentMethod}</td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-400">Belum ada donasi terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChildrenTab = () => {
    const { data, isLoading } = childrenReport;
    if (isLoading) return <div className="py-12 text-center text-gray-500">Loading data anak asuh...</div>;

    const genderStats = data?.data?.statistics?.gender || [];
    const educationStats = data?.data?.statistics?.education || [];
    const list = data?.data?.children || [];

    const totalChildren = list.length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Gender</h3>
            <div className="space-y-4">
              {genderStats.map((g: any, i: number) => {
                const pct = totalChildren > 0 ? Math.round((g.count / totalChildren) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="capitalize text-gray-700">{g._id === 'laki-laki' ? 'Laki-Laki' : 'Perempuan'}</span>
                      <span className="text-gray-900">{pct}% ({g.count} Anak)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${g._id === 'laki-laki' ? 'bg-teal' : 'bg-teal-light'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {genderStats.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada data statistik gender.</p>
              )}
            </div>
          </div>

          {/* Education Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tingkat Pendidikan</h3>
            <div className="space-y-4">
              {educationStats.map((edu: any, i: number) => {
                const pct = totalChildren > 0 ? Math.round((edu.count / totalChildren) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="uppercase text-gray-700">{edu._id || 'Belum Sekolah'}</span>
                      <span className="text-gray-900">{pct}% ({edu.count} Anak)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-teal h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {educationStats.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada data statistik pendidikan.</p>
              )}
            </div>
          </div>
        </div>

        {/* Children List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Anak Asuh Terdaftar</h3>
          <div className="overflow-x-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Nama</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Gender</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Sekolah/Tingkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {list.map((child: any) => {
                  const birthDate = child.dateOfBirth ? new Date(child.dateOfBirth) : null;
                  const today = new Date();
                  const ageVal = birthDate && !isNaN(birthDate.getTime())
                    ? today.getFullYear() - birthDate.getFullYear()
                    : null;
                  const ageText = ageVal !== null ? ` (${ageVal} th)` : '';

                  return (
                    <tr key={child._id || child.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{child.name}{ageText}</td>
                      <td className="px-4 py-3 capitalize text-gray-600">{child.gender}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            child.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {child.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {child.currentStatus?.schoolName || '-'} / {child.currentStatus?.grade || '-'}
                      </td>
                    </tr>
                  );
                })}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400">Belum ada anak asuh.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderActivitiesTab = () => {
    const { data, isLoading } = activitiesReport;
    if (isLoading) return <div className="py-12 text-center text-gray-500">Loading data kegiatan...</div>;

    const categories = data?.data?.statistics?.category || [];
    const types = data?.data?.statistics?.type || [];
    const list = data?.data?.activities || [];

    const totalActivities = list.length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Kategori Kegiatan</h3>
            <div className="space-y-4">
              {categories.map((c: any, i: number) => {
                const pct = totalActivities > 0 ? Math.round((c.count / totalActivities) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="capitalize text-gray-700">{c._id || 'Lainnya'}</span>
                      <span className="text-gray-900">{pct}% ({c.count} Kegiatan)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-teal h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada data kategori kegiatan.</p>
              )}
            </div>
          </div>

          {/* Types */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tipe Kegiatan</h3>
            <div className="space-y-4">
              {types.map((t: any, i: number) => {
                const pct = totalActivities > 0 ? Math.round((t.count / totalActivities) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="capitalize text-gray-700">{t._id || 'Lainnya'}</span>
                      <span className="text-gray-900">{pct}% ({t.count} Kegiatan)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-teal-light h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {types.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada data tipe kegiatan.</p>
              )}
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Riwayat Kegiatan Terbaru</h3>
          <div className="overflow-x-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Judul Kegiatan</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Kategori</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Tipe</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {list.map((act: any) => {
                  let dateText = 'Tidak ada tanggal';
                  if (act.schedule?.startDate) {
                    try {
                      const parsedDate = new Date(act.schedule.startDate);
                      if (!isNaN(parsedDate.getTime())) {
                        dateText = parsedDate.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        });
                      }
                    } catch (e) {
                      dateText = act.schedule.startDate;
                    }
                  }

                  return (
                    <tr key={act._id || act.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{act.title}</span>
                          <span className="text-xs text-gray-400">{dateText} • {act.location?.name || 'Lokasi N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">{act.category}</td>
                      <td className="px-4 py-3 capitalize text-indigo-600 font-medium">{act.type}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800 capitalize border border-gray-200">
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400">Belum ada kegiatan terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersTab = () => {
    const { data, isLoading } = usersReport;
    if (isLoading) return <div className="py-12 text-center text-gray-500">Loading data pengguna...</div>;

    const rolesBreakdown = data?.data?.statistics || [];
    const list = data?.data?.users || [];
    const totalUsers = list.length;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Roles Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Breakdown Peran Pengguna</h3>
          <div className="space-y-4">
            {rolesBreakdown.map((role: any, i: number) => {
              const pct = totalUsers > 0 ? Math.round((role.count / totalUsers) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="capitalize text-gray-700">{role._id || 'Lainnya'}</span>
                    <span className="text-gray-900">{pct}% ({role.count} User)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-teal h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
            {rolesBreakdown.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada data breakdown user.</p>
            )}
          </div>
        </div>

        {/* User List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Pengguna Terbaru</h3>
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Nama / Email</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Peran (Role)</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {list.map((u: any) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{u.name}</span>
                        <span className="text-xs text-gray-500">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize font-semibold text-indigo-600">{u.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                          u.status === 'approved'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {u.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400">Belum ada user terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Laporan & Statistik</h1>
          <p className="mt-2 text-gray-600">
            Analisis data, monitoring donasi, demografi anak asuh, serta statistik interaksi pengguna secara real-time.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex -mb-px space-x-8 overflow-x-auto pb-px" aria-label="Tabs">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    active
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'donations' && renderDonationsTab()}
          {activeTab === 'children' && renderChildrenTab()}
          {activeTab === 'activities' && renderActivitiesTab()}
          {activeTab === 'users' && renderUsersTab()}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
