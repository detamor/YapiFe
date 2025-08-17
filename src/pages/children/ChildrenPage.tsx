import React from 'react';
import ChildCard from '../../components/children/ChildCard';

const ChildrenPage: React.FC = () => {
  const mockChildren = [
    {
      id: '1',
      name: 'Ahmad Rizki',
      dateOfBirth: '2015-03-15',
      gender: 'male' as const,
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
      story: 'Ahmad adalah anak yang ceria dan suka belajar. Dia bercita-cita menjadi dokter untuk membantu orang lain.',
      currentStatus: {
        living: 'Dengan keluarga',
        health: 'Sehat',
        education: 'SD Kelas 3'
      },
      skills: ['Membaca', 'Matematika', 'Menggambar'],
      isActive: true,
      isPublic: true,
      isFeatured: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      dateOfBirth: '2016-07-22',
      gender: 'female' as const,
      images: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'],
      story: 'Siti sangat menyukai musik dan bernyanyi. Dia ingin menjadi penyanyi terkenal suatu hari nanti.',
      currentStatus: {
        living: 'Dengan keluarga',
        health: 'Sehat',
        education: 'SD Kelas 2'
      },
      skills: ['Bernyanyi', 'Menari', 'Bahasa Inggris'],
      isActive: true,
      isPublic: true,
      isFeatured: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockChildren.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildrenPage;





