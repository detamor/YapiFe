import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import ChildCard from '../../components/children/ChildCard';

const ChildrenPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [livingStatus, setLivingStatus] = useState('');
  const [isSponsored, setIsSponsored] = useState('');

  // Fetch children data from API with filters
  const {
    data: children,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['public-children', search, gender, livingStatus, isSponsored],
    queryFn: async () => {
      const params: any = { limit: 100 }; // Ambil banyak untuk tampilan publik
      if (search) params.search = search;
      if (gender) params.gender = gender === 'male' ? 'laki-laki' : 'perempuan';
      if (livingStatus) params.livingStatus = livingStatus;
      if (isSponsored) params.isSponsored = isSponsored;

      const response = await api.get('/children', { params });
      console.log('📊 Public filtered children data:', response.data);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Transform API data to match ChildCard interface
  const transformChild = (child: any) => ({
    id: child._id || child.id,
    name: child.name,
    dateOfBirth: child.dateOfBirth,
    gender: child.gender === 'laki-laki' ? 'male' : 'female',
    images: child.images?.map((img: any) => img.url || img) || [],
    story:
      child.background?.story ||
      `${child.name} adalah anak asuh YAPI Medan yang membutuhkan dukungan hangat Anda.`,
    currentStatus: {
      living:
        child.currentStatus?.livingStatus === 'di-yayasan'
          ? 'Di Yayasan'
          : 'Keluarga Asuh',
      health:
        child.currentStatus?.healthStatus === 'sehat'
          ? 'Sehat'
          : 'Perhatian Khusus',
      education: child.currentStatus?.educationLevel?.toUpperCase() || child.currentStatus?.grade || 'SD',
    },
    skills: child.skills?.map((skill: any) => skill.name) || [],
    isActive: child.isActive,
    isPublic: child.isPublic,
    isFeatured: child.sponsorship?.isSponsored || false, // Mengambil status sponsor sebenarnya
    createdAt: child.createdAt,
    updatedAt: child.updatedAt,
  });

  // Use API data if available
  const displayChildren = (() => {
    let childrenArray = [];

    if (children?.data && Array.isArray(children.data)) {
      childrenArray = children.data;
    } else if (children?.data && typeof children.data === 'object') {
      childrenArray = children.data.children || children.data.data || [];
    } else if (Array.isArray(children)) {
      childrenArray = children;
    }

    return childrenArray.length > 0
      ? childrenArray.filter((child: any) => child.isPublic).map(transformChild)
      : [];
  })();

  if (isLoading) {
    return (
      <div className="bg-parchment min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="bg-parchment min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-teal font-semibold text-xs tracking-wider uppercase font-sans">
            Menyambung Benang Harapan
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-teal mt-2">
            Anak Asuh YAPI Medan
          </h1>
          <p className="mt-4 text-base text-ink-soft max-w-xl mx-auto font-sans leading-relaxed">
            Pilih dan kenali adik asuh yang ingin Anda sponsori. Dukungan finansial Anda menjamin pendidikan dan masa depan mereka.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-coral/10 border border-coral/30 rounded-md max-w-md mx-auto">
              <p className="text-coral text-sm">
                Gagal memuat data dari server. Menampilkan data lokal jika tersedia.
              </p>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg p-6 border border-parchment-dim shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-end">
          {/* Search Box */}
          <div className="flex-1 w-full">
            <label htmlFor="search" className="block text-xs font-semibold text-ink-soft mb-1.5 uppercase tracking-wider">
              Cari Nama Anak
            </label>
            <input
              id="search"
              type="text"
              placeholder="Contoh: Siti, Ahmad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field py-2"
            />
          </div>

          {/* Gender Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="gender" className="block text-xs font-semibold text-ink-soft mb-1.5 uppercase tracking-wider">
              Jenis Kelamin
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input-field py-2 bg-white"
            >
              <option value="">Semua</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          {/* Living Status Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="livingStatus" className="block text-xs font-semibold text-ink-soft mb-1.5 uppercase tracking-wider">
              Status Tinggal
            </label>
            <select
              id="livingStatus"
              value={livingStatus}
              onChange={(e) => setLivingStatus(e.target.value)}
              className="input-field py-2 bg-white"
            >
              <option value="">Semua</option>
              <option value="di-yayasan">Di Yayasan</option>
              <option value="keluarga-asuh">Keluarga Asuh</option>
            </select>
          </div>

          {/* Sponsorship Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="sponsorship" className="block text-xs font-semibold text-ink-soft mb-1.5 uppercase tracking-wider">
              Status Sponsor
            </label>
            <select
              id="sponsorship"
              value={isSponsored}
              onChange={(e) => setIsSponsored(e.target.value)}
              className="input-field py-2 bg-white"
            >
              <option value="">Semua</option>
              <option value="false">Belum Disponsori</option>
              <option value="true">Telah Disponsori</option>
            </select>
          </div>
        </div>

        {/* Weave Divider */}
        <div className="weave-divider mb-10"></div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayChildren.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>

        {/* Empty State */}
        {displayChildren.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-parchment-dim p-8 shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-ink-soft/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-teal font-serif">Tidak Ada Data Anak</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Tidak ditemukan data anak asuh yang cocok dengan filter pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenPage;
