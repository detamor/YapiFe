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
  skills?: any[];
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
  purpose?: string;
  status: 'pending' | 'completed' | 'verified' | 'failed' | 'cancelled' | 'approved' | 'rejected';
  createdAt: string;
  receiptNumber?: string;
  paymentMethod?: string;
  snapToken?: string;
  child?: {
    id: string;
    _id?: string;
    name: string;
    nickname?: string;
  };
  campaign?: {
    id: string;
    title: string;
    description?: string;
  };
}

const DonaturDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
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
      case 'completed':
      case 'verified':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Berhasil';
      case 'verified':
        return 'Terverifikasi';
      case 'approved':
        return 'Disetujui';
      case 'pending':
        return 'Menunggu';
      case 'failed':
        return 'Gagal';
      case 'cancelled':
        return 'Dibatalkan';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatFullDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const dateFormatted = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const timeFormatted = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return `${dateFormatted}, ${timeFormatted} WIB`;
    } catch (e) {
      return dateStr;
    }
  };

  const formatShortAmount = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1).replace('.0', '') + 'jt';
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(0) + 'rb';
    }
    return val.toString();
  };

  // Group donations by category label
  const categoryLabels: { [key: string]: string } = {
    'pendidikan': '📚 Beasiswa Pendidikan',
    'kesehatan': '⚕️ Pelayanan Kesehatan',
    'makanan': '🍲 Pangan & Nutrisi',
    'pakaian': '👕 Sandang & Pakaian',
    'tempat-tinggal': '🏠 Sarana & Asrama',
    'kegiatan': '🎨 Kegiatan Sosial & Spiritual',
    'sponsorship': '🤝 Sponsorship Anak Asuh',
    'umum': '✨ Kebutuhan Umum'
  };

  // Process data for charts
  const donationsList = donationsData?.data?.donations || [];
  const completedDonations = donationsList.filter(
    (d: any) => d.status === 'completed' || d.status === 'verified' || d.status === 'approved'
  );

  const totalDonationCount = completedDonations.length;
  const totalNominal = completedDonations.reduce((sum: number, d: any) => sum + d.amount, 0);

  // Categories breakdown
  const categoryMap = new Map<string, { label: string; amount: number; count: number }>();
  completedDonations.forEach((d: any) => {
    const cat = d.category || 'umum';
    const label = categoryLabels[cat] || `✨ Kebutuhan ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
    const existing = categoryMap.get(cat) || { label, amount: 0, count: 0 };
    existing.amount += d.amount;
    existing.count += 1;
    categoryMap.set(cat, existing);
  });
  const categoryList = Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);

  // Children breakdown
  const childMap = new Map<string, { name: string; amount: number; count: number }>();
  completedDonations.forEach((d: any) => {
    if (d.child) {
      const childName = typeof d.child === 'object' ? d.child.name : 'Anak Asuh';
      const childId = typeof d.child === 'object' ? d.child.id || d.child._id : d.child;
      if (childId) {
        const existing = childMap.get(childId) || { name: childName, amount: 0, count: 0 };
        existing.amount += d.amount;
        existing.count += 1;
        childMap.set(childId, existing);
      }
    }
  });
  const childList = Array.from(childMap.values()).sort((a, b) => b.amount - a.amount);

  // Dynamic monthly chart calculations (last 6 months)
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      monthName: d.toLocaleString('id-ID', { month: 'long' }),
      monthShort: d.toLocaleString('id-ID', { month: 'short' }),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      total: 0
    };
  });

  completedDonations.forEach((d: any) => {
    const date = new Date(d.createdAt);
    const month = date.getMonth();
    const year = date.getFullYear();
    const match = last6Months.find(m => m.monthIndex === month && m.year === year);
    if (match) {
      match.total += d.amount;
    }
  });

  const maxMonthVal = Math.max(...last6Months.map(m => m.total), 100000); // base limit is 100k

  const chartPoints = last6Months.map((m, idx) => {
    const x = 50 + idx * 100;
    // Scale y coordinate from 160 (min / 0) to 40 (maxMonthVal)
    const y = 160 - (m.total / maxMonthVal) * 120;
    return { x, y, ...m };
  });

  // SVG Line path construction
  const pathD = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${chartPoints[chartPoints.length - 1].x} 170 L ${chartPoints[0].x} 170 Z`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Donatur
          </h1>
          <p className="mt-2 text-gray-600">
            Selamat datang, {user?.name}! Kelola donasi dan lihat kontribusi Anda untuk panti asuhan.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 flex items-center transition-all duration-300 hover:shadow-md">
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
              <HeartIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Donasi Sukses
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalDonationCount} kali
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                dari {donationsList.length} transaksi tercatat
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 flex items-center transition-all duration-300 hover:shadow-md">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Dana Disalurkan
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(totalNominal)}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">
                Status Terverifikasi & Sukses
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 flex items-center transition-all duration-300 hover:shadow-md">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Anak Asuh Dibantu
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {childList.length} anak
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                dari total {((childrenData?.data as any)?.children || childrenData?.data?.items || []).length} anak asuh
              </p>
            </div>
          </div>
        </div>

        {/* Personal Donation Analytics Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 mb-8 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="text-xl mr-2">📈</span> Grafik Kontribusi Donasi Anda
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">Riwayat donasi bulanan Anda selama 6 bulan terakhir</p>
            </div>
            <div className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-full">
              Periode 6 Bulan Terakhir
            </div>
          </div>
          
          <div className="h-64 w-full pt-4 border-b border-l border-gray-200/80 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="160" x2="600" y2="160" stroke="#f3f4f6" strokeWidth="1" />

              {/* Area under the line */}
              {totalDonationCount > 0 && (
                <path 
                  d={areaD} 
                  fill="url(#donationGradient)"
                />
              )}

              {/* Line path connecting points */}
              {totalDonationCount > 0 && (
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Dots and Labels */}
              {chartPoints.map((p, idx) => (
                <g key={idx} className="cursor-pointer group">
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="6" 
                    fill="#4f46e5" 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                    className="transition-all duration-200 group-hover:scale-150 group-hover:fill-indigo-600" 
                  />
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="12" 
                    fill="#4f46e5" 
                    fillOpacity="0"
                    className="transition-all duration-200 group-hover:fill-opacity-15"
                  />
                  
                  {/* X-axis labels */}
                  <text 
                    x={p.x} 
                    y="190" 
                    fill="#6b7280" 
                    fontSize="11" 
                    textAnchor="middle"
                    className="font-medium"
                  >
                    {p.monthShort}
                  </text>

                  {/* Value label above point */}
                  <text 
                    x={p.x} 
                    y={p.y - 12} 
                    fill={p.total > 0 ? '#4f46e5' : '#9ca3af'} 
                    fontSize="10" 
                    textAnchor="middle" 
                    fontWeight={p.total > 0 ? 'bold' : 'normal'}
                  >
                    {formatShortAmount(p.total)}
                  </text>
                </g>
              ))}
            </svg>
            
            {totalDonationCount === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-[1px]">
                <p className="text-gray-500 text-sm font-medium">Belum ada riwayat donasi sukses untuk ditampilkan di grafik</p>
              </div>
            )}
          </div>
        </div>

        {/* Alokasi & Penyaluran Dana */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribusi per Kategori */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
              <span className="text-xl mr-2">📌</span> Alokasi Donasi per Kategori
            </h3>
            <p className="text-xs text-gray-500 mb-6">Penyebaran donasi Anda untuk berbagai kategori kebutuhan</p>
            
            {categoryList.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center h-48 bg-gray-50/50">
                <span className="text-3xl block mb-2">✨</span>
                <p className="text-sm text-gray-500 font-medium">Belum ada alokasi donasi kategori</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryList.map((cat, idx) => {
                  const percent = totalNominal > 0 ? (cat.amount / totalNominal) * 100 : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-semibold text-gray-700">{cat.label}</span>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">{formatCurrency(cat.amount)}</span>
                          <span className="text-xs text-gray-400 ml-1.5">({cat.count}x donasi)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-[10px] text-gray-400 mt-0.5 font-medium">
                        {percent.toFixed(1)}% dari total dana disalurkan
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Distribusi per Anak */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md animate-slide-up">
            <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
              <span className="text-xl mr-2">❤️</span> Anak-anak yang Anda Bantu
            </h3>
            <p className="text-xs text-gray-500 mb-6">Penyaluran dana langsung untuk beasiswa / sponsorship anak asuh</p>
            
            {childList.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center h-48 bg-gray-50/50">
                <span className="text-3xl block mb-2">👦👧</span>
                <p className="text-sm text-gray-600 font-semibold">Tidak Ada Donasi Khusus Anak</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs text-center px-4">
                  Anda belum menyalurkan donasi khusus untuk anak tertentu. Semua donasi saat ini disalurkan untuk Kebutuhan Umum.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {childList.map((ch, idx) => {
                  const percent = totalNominal > 0 ? (ch.amount / totalNominal) * 100 : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-semibold text-gray-700">👦 {ch.name}</span>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">{formatCurrency(ch.amount)}</span>
                          <span className="text-xs text-gray-400 ml-1.5">({ch.count}x donasi)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-[10px] text-gray-400 mt-0.5 font-medium">
                        {percent.toFixed(1)}% dari total dana disalurkan
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 mb-8 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mulai Kebaikan Baru</h2>
              <p className="text-sm text-gray-500 mt-0.5">Bantu anak-anak asuh panti memenuhi kebutuhan hidup & pendidikan mereka.</p>
            </div>
            <button
              onClick={() => setShowDonationForm(true)}
              className="btn-primary flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Donasi Baru
            </button>
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 mb-8 transition-all duration-300 hover:shadow-md animate-fade-in">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              Anak-anak yang Membutuhkan Bantuan
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Dukung beasiswa sekolah atau kebutuhan harian anak secara personal
            </p>
          </div>

          {childrenLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {((childrenData?.data as any)?.children || childrenData?.data?.items || []).slice(0, 3).map((child: Child) => (
                  <div
                    key={child.id}
                    className="border border-gray-200/80 rounded-xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-lg">
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 leading-snug">
                            {child.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {child.currentStatus.education} - {child.currentStatus.living}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {child.story}
                      </p>

                      {child.skills && child.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Keterampilan:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {child.skills.slice(0, 3).map((skill: any, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 font-semibold rounded-full"
                              >
                                {typeof skill === 'object' && skill !== null ? skill.name : skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <a
                      href={`/donation-form?childId=${child.id}&childName=${encodeURIComponent(child.name)}&category=sponsorship`}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center text-center mt-2 shadow-sm"
                    >
                      Bantu Sekarang
                    </a>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <a href="/children" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Lihat Semua Anak Asuh &rarr;
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Donations History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 mb-8 transition-all duration-300 hover:shadow-md animate-fade-in">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Riwayat Lengkap Donasi Anda
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Daftar semua transaksi donasi yang Anda lakukan, lengkap dengan rincian peruntukan & waktu.
              </p>
            </div>
            <div className="text-xs text-gray-400">
              Total {donationsList.length} Transaksi
            </div>
          </div>

          {donationsLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : donationsList.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-gray-50/50">
              <span className="text-4xl block mb-2">🎁</span>
              <p className="font-semibold text-gray-700">Belum Ada Riwayat Donasi</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Mulai donasi pertama Anda untuk membantu anak-anak yatim piatu sekarang juga.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/80">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tanggal &amp; Waktu Lengkap
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Nominal
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Peruntukan / Penerima
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {donationsList.map((donation: any) => (
                    <tr key={donation.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-700">
                        {formatFullDateTime(donation.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-800 max-w-xs">
                        <div className="font-bold text-gray-900">
                          {categoryLabels[donation.category] || donation.category}
                        </div>
                        {donation.child && (
                          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center">
                            <span className="mr-1">👦</span> Penerima: {typeof donation.child === 'object' ? donation.child.name : 'Anak Asuh'}
                          </div>
                        )}
                        {donation.purpose && (
                          <div className="text-[10px] text-gray-400 italic mt-0.5 line-clamp-1">
                            "{donation.purpose}"
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {getStatusLabel(donation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-semibold">
                        <button 
                          onClick={() => setSelectedDonation(donation)}
                          className="mx-auto text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 px-3 py-1 rounded-md transition-all flex items-center gap-1"
                        >
                          <EyeIcon className="h-4 w-4" />
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-6 border w-full max-w-2xl shadow-xl rounded-xl bg-white animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🎁</span> Buat Donasi Baru
              </h3>
              <button
                onClick={() => setShowDonationForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
            <div className="mt-2 max-h-[80vh] overflow-y-auto pr-1">
              <DonationForm />
            </div>
          </div>
        </div>
      )}

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-up relative border border-gray-100">
            <button
              onClick={() => setSelectedDonation(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <HeartIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Rincian Donasi</h3>
              <p className="text-xs text-gray-500 font-mono mt-1">{selectedDonation.receiptNumber || `ID: ${selectedDonation.id}`}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Tanggal Transaksi</span>
                <span className="font-semibold text-gray-900 text-right">{formatFullDateTime(selectedDonation.createdAt)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Nominal Donasi</span>
                <span className="font-bold text-indigo-600 text-base">{formatCurrency(selectedDonation.amount)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Kategori Alokasi</span>
                <span className="font-medium text-gray-900">{categoryLabels[selectedDonation.category] || selectedDonation.category}</span>
              </div>
              {selectedDonation.child && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Penerima Manfaat</span>
                  <span className="font-medium text-emerald-600">👦 {typeof selectedDonation.child === 'object' ? selectedDonation.child.name : 'Anak Asuh'}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-medium text-gray-900 capitalize">
                  {selectedDonation.paymentMethod === 'bank-transfer' && selectedDonation.snapToken ? 'Otomatis (Xendit QRIS/VA)' : (selectedDonation.paymentMethod || 'Otomatis')}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Status Pembayaran</span>
                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(selectedDonation.status)}`}>
                  {getStatusLabel(selectedDonation.status)}
                </span>
              </div>
              {selectedDonation.purpose && (
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 border border-gray-100">
                  <p className="font-semibold text-gray-700 mb-1">Catatan / Pesan:</p>
                  <p className="italic">"{selectedDonation.purpose}"</p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {selectedDonation.status === 'pending' && selectedDonation.snapToken && (
                <a
                  href={selectedDonation.snapToken}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center text-center font-bold shadow-md py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
                >
                  💳 Lanjutkan Pembayaran (Scan QRIS / VA)
                </a>
              )}
              <button
                onClick={() => setSelectedDonation(null)}
                className="w-full text-center py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonaturDashboardPage;
