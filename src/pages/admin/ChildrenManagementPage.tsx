import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
  education_level: string;
  skills?: string[];
  images?: string[];
  created_at: string;
}

const ChildrenManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    education_level: '',
    skills: '',
    status: 'active',
  });

  const queryClient = useQueryClient();

  // Fetch children data
  const { data: children, isLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const response = await api.get('/children');
      return response.data;
    },
  });

  // Create/Update child mutation
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingChild) {
        return api.put(`/children/${editingChild.id}`, data);
      } else {
        return api.post('/children', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast.success(
        editingChild ? 'Anak berhasil diupdate!' : 'Anak berhasil ditambahkan!'
      );
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan!');
    },
  });

  // Delete child mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/children/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast.success('Anak berhasil dihapus!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus anak!');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'male',
      education_level: '',
      skills: '',
      status: 'active',
    });
    setEditingChild(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      age: parseInt(formData.age),
      skills: formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
    mutation.mutate(data);
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      age: child.age.toString(),
      gender: child.gender,
      education_level: child.education_level,
      skills: child.skills?.join(', ') || '',
      status: child.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anak ini?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kelola Anak-anak
            </h1>
            <p className="mt-2 text-gray-600">
              Tambah, edit, dan kelola data anak-anak YAPI Medan
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            + Tambah Anak Baru
          </button>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children?.data?.map((child: Child) => (
            <div
              key={child.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {child.images?.[0] ? (
                  <img
                    src={child.images[0]}
                    alt={child.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">👶</div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {child.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {child.age} tahun •{' '}
                      {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      child.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {child.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  Pendidikan: {child.education_level}
                </p>

                {child.skills && child.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Keterampilan:</p>
                    <div className="flex flex-wrap gap-1">
                      {child.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(child)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editingChild ? 'Edit Anak' : 'Tambah Anak Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usia
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as 'male' | 'female',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tingkat Pendidikan
                  </label>
                  <input
                    type="text"
                    value={formData.education_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        education_level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: SD Kelas 3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterampilan (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: Menulis, Menggambar, Menyanyi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {mutation.isPending
                      ? 'Menyimpan...'
                      : editingChild
                      ? 'Update'
                      : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenManagementPage;



