import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import ChildCard from '../../components/children/ChildCard';

const ChildrenPage: React.FC = () => {
  // Fetch children data from API
  const {
    data: children,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['public-children'],
    queryFn: async () => {
      const response = await api.get('/children');
      console.log('📊 Public children data:', response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mock data sebagai fallback
  const mockChildren = [
    {
      id: '1',
      name: 'Ahmad Rizki',
      dateOfBirth: '2015-03-15',
      gender: 'male' as const,
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      ],
      story:
        'Ahmad adalah anak yang ceria dan suka belajar. Dia bercita-cita menjadi dokter untuk membantu orang lain.',
      currentStatus: {
        living: 'Dengan keluarga',
        health: 'Sehat',
        education: 'SD Kelas 3',
      },
      skills: ['Membaca', 'Matematika', 'Menggambar'],
      isActive: true,
      isPublic: true,
      isFeatured: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      dateOfBirth: '2016-07-22',
      gender: 'female' as const,
      images: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      ],
      story:
        'Siti sangat menyukai musik dan bernyanyi. Dia ingin menjadi penyanyi terkenal suatu hari nanti.',
      currentStatus: {
        living: 'Dengan keluarga',
        health: 'Sehat',
        education: 'SD Kelas 2',
      },
      skills: ['Bernyanyi', 'Menari', 'Bahasa Inggris'],
      isActive: true,
      isPublic: true,
      isFeatured: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  // Transform API data to match ChildCard interface
  const transformChild = (child: any) => ({
    id: child._id,
    name: child.name,
    dateOfBirth: child.dateOfBirth,
    gender: child.gender === 'laki-laki' ? 'male' : 'female',
    images: child.images?.map((img: any) => img.url || img) || [],
    story:
      child.background?.story ||
      `${child.name} adalah anak yang membutuhkan bantuan.`,
    currentStatus: {
      living:
        child.currentStatus?.livingStatus === 'di-yayasan'
          ? 'Di Yayasan'
          : 'Dengan keluarga',
      health:
        child.currentStatus?.healthStatus === 'sehat'
          ? 'Sehat'
          : 'Perlu perhatian',
      education: child.currentStatus?.grade || 'SD',
    },
    skills: child.skills?.map((skill: any) => skill.name) || [],
    isActive: child.isActive,
    isPublic: child.isPublic,
    isFeatured: false,
    createdAt: child.createdAt,
    updatedAt: child.updatedAt,
  });

  // Use API data if available, otherwise use mock data
  const displayChildren = (() => {
    // Handle different response structures like in admin
    let childrenArray = [];

    if (children?.data && Array.isArray(children.data)) {
      childrenArray = children.data;
    } else if (children?.data && typeof children.data === 'object') {
      // If data is an object, try to find children array
      childrenArray = children.data.children || children.data.data || [];
    } else if (Array.isArray(children)) {
      childrenArray = children;
    }

    console.log('🔍 Public children array:', childrenArray);

    return childrenArray.length > 0
      ? childrenArray.filter((child: any) => child.isPublic).map(transformChild)
      : [];
  })();

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Anak-anak Yang Membutuhkan
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Kenali anak-anak yang membutuhkan bantuan Anda
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
              <p className="text-yellow-800 text-sm">
                Menggunakan data contoh karena tidak dapat terhubung ke server.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayChildren.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>

        {displayChildren.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada data anak yang tersedia untuk ditampilkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenPage;
