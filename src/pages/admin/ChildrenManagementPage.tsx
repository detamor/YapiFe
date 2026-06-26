import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Child {
  _id: string;
  name: string;
  dateOfBirth: string;
  gender: 'laki-laki' | 'perempuan';
  isActive: boolean;
  isPublic: boolean;
  background: {
    story: string;
    familyStatus: string;
    healthHistory: string;
  };
  currentStatus: {
    livingStatus: string;
    healthStatus: string;
    educationLevel: string;
    schoolName: string;
    grade: string;
  };
  skills: Array<{
    name: string;
    level: string;
    description: string;
  }>;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

const ChildrenManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    skills: '',
    status: 'active',
    profileImage: null as File | null,
    story: '',
    familyStatus: 'yatim-piatu',
    livingStatus: 'di-yayasan',
    healthStatus: 'sehat',
    educationLevel: 'sd',
    schoolName: 'SD YAPI Medan',
    grade: '',
  });

  const queryClient = useQueryClient();

  // Fetch children data
  const {
    data: children,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const response = await api.get('/children');
      console.log('📊 Children data from API:', response.data);
      console.log('📊 Children array:', response.data?.data);
      console.log('📊 Children length:', response.data?.data?.length);
      console.log('📊 First child images:', response.data?.data?.[0]?.images);
      console.log('📊 Response structure:', {
        success: response.data?.success,
        message: response.data?.message,
        data: response.data?.data,
        dataType: typeof response.data?.data,
        isArray: Array.isArray(response.data?.data),
        keys: response.data ? Object.keys(response.data) : [],
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('❌ Children fetch error:', error);
    },
  });

  // Create/Update child mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormData | any) => {
      if (editingChild) {
        return api.put(`/children/${editingChild._id}`, formData);
      } else {
        return api.post('/children', formData);
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
      console.error('❌ Mutation error:', error);
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
      skills: '',
      status: 'active',
      profileImage: null,
      story: '',
      familyStatus: 'yatim-piatu',
      livingStatus: 'di-yayasan',
      healthStatus: 'sehat',
      educationLevel: 'sd',
      schoolName: 'SD YAPI Medan',
      grade: '',
    });
    setEditingChild(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate date of birth from age
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - parseInt(formData.age);
    const dateOfBirth = new Date(birthYear, 0, 1).toISOString().split('T')[0];

    const data = {
      name: formData.name,
      dateOfBirth: dateOfBirth,
      gender: formData.gender === 'male' ? 'laki-laki' : 'perempuan',
      background: {
        story: formData.story || `Anak bernama ${formData.name} dengan usia ${formData.age} tahun.`,
        familyStatus: formData.familyStatus,
        healthHistory: 'Sehat',
      },
      currentStatus: {
        livingStatus: formData.livingStatus,
        healthStatus: formData.healthStatus,
        educationLevel: formData.educationLevel,
        schoolName: formData.schoolName,
        grade: formData.grade,
      },
      skills: formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((skill) => ({
          name: skill,
          level: 'menengah',
          description: `Keterampilan ${skill}`,
        })),
      isActive: formData.status === 'active',
      isPublic: true,
    };

    // Handle file upload if image is selected
    if (formData.profileImage) {
      const formDataWithFile = new FormData();

      // Add the image file
      formDataWithFile.append('profileImage', formData.profileImage);

      // Add other data fields
      Object.keys(data).forEach((key) => {
        const val = (data as any)[key];
        if (
          key === 'skills' ||
          key === 'background' ||
          key === 'currentStatus'
        ) {
          formDataWithFile.append(key, JSON.stringify(val));
        } else if (typeof val === 'boolean') {
          formDataWithFile.append(key, val.toString());
        } else {
          formDataWithFile.append(key, val);
        }
      });

      console.log('📝 Submitting child data with image:', data);
      console.log('📝 Image file:', formData.profileImage);

      // Use FormData for file upload
      mutation.mutate(formDataWithFile);
    } else {
      console.log('📝 Submitting child data without image:', data);
      mutation.mutate(data);
    }
  };

  const handleEdit = (child: Child) => {
    // Calculate age from dateOfBirth
    const birthDate = new Date(child.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    setEditingChild(child);
    setFormData({
      name: child.name,
      age: age.toString(),
      gender: child.gender === 'laki-laki' ? 'male' : 'female',
      skills: child.skills ? child.skills.map((skill) => skill.name).join(', ') : '',
      status: child.isActive ? 'active' : 'inactive',
      profileImage: null,
      story: child.background?.story || '',
      familyStatus: child.background?.familyStatus || 'yatim-piatu',
      livingStatus: child.currentStatus?.livingStatus || 'di-yayasan',
      healthStatus: child.currentStatus?.healthStatus || 'sehat',
      educationLevel: child.currentStatus?.educationLevel || 'sd',
      schoolName: child.currentStatus?.schoolName || 'SD YAPI Medan',
      grade: child.currentStatus?.grade || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anak ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors shadow-md"
          >
            + Tambah Anak Baru
          </button>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            // Handle different response structures
            let childrenArray = [];

            if (children?.data && Array.isArray(children.data)) {
              childrenArray = children.data;
            } else if (children?.data && typeof children.data === 'object') {
              // If data is an object, try to find children array
              childrenArray =
                children.data.children || children.data.data || [];
            } else if (Array.isArray(children)) {
              childrenArray = children;
            }

            console.log('🔍 Final children array:', childrenArray);
            console.log(
              '🔍 Children with images:',
              childrenArray.filter(
                (child: any) => child.images && child.images.length > 0
              )
            );

            return childrenArray.length > 0 ? (
              childrenArray.map((child: Child) => {
                // Calculate age from dateOfBirth
                const birthDate = new Date(child.dateOfBirth);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();

                return (
                  <div
                    key={child._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {child.images?.[0] ? (
                        <img
                          src={
                            (() => {
                              const img = child.images[0] as any;
                              const url = typeof img === 'object' && img !== null ? img.url : img;
                              if (!url) return '';
                              return url.startsWith('http')
                                ? url
                                : url.startsWith('/uploads')
                                ? url
                                : `/uploads${url}`;
                            })()
                          }
                          alt={child.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove(
                              'hidden'
                            );
                          }}
                        />
                      ) : child.images?.[0] ? (
                        <img
                          src={
                            child.images[0].startsWith('http')
                              ? child.images[0]
                              : child.images[0].startsWith('/uploads')
                              ? child.images[0]
                              : `/uploads${child.images[0]}`
                          }
                          alt={child.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove(
                              'hidden'
                            );
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {child.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {age} tahun • {child.gender}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            child.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {child.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        Pendidikan: {child.currentStatus?.grade || 'Belum diisi'}
                      </p>

                      {child.skills && child.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Keterampilan:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {child.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(child)}
                          className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(child._id)}
                          className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  Tidak ada data anak yang tersedia
                </p>
              </div>
            );
          })()}
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      min="1"
                      max="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Keluarga
                    </label>
                    <select
                      value={formData.familyStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, familyStatus: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="yatim">Yatim</option>
                      <option value="piatu">Piatu</option>
                      <option value="yatim-piatu">Yatim Piatu</option>
                      <option value="keluarga-tidak-mampu">Keluarga Tidak Mampu</option>
                      <option value="terlantar">Terlantar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Tinggal
                    </label>
                    <select
                      value={formData.livingStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, livingStatus: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="di-yayasan">Di Yayasan</option>
                      <option value="keluarga-asuh">Keluarga Asuh</option>
                      <option value="mandiri">Mandiri</option>
                      <option value="lulus">Lulus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cerita / Kisah Latar Belakang
                  </label>
                  <textarea
                    value={formData.story}
                    onChange={(e) =>
                      setFormData({ ...formData, story: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Ceritakan kisah hidup dan latar belakang anak..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pendidikan
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, educationLevel: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="belum-sekolah">Belum Sekolah</option>
                      <option value="tk">TK</option>
                      <option value="sd">SD</option>
                      <option value="smp">SMP</option>
                      <option value="sma">SMA</option>
                      <option value="kuliah">Kuliah</option>
                      <option value="lulus">Lulus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kelas / Tingkat
                    </label>
                    <input
                      type="text"
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Contoh: Kelas 4, Semester 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Sekolah
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) =>
                        setFormData({ ...formData, schoolName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Nama Sekolah"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Kesehatan
                    </label>
                    <select
                      value={formData.healthStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, healthStatus: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="sehat">Sehat</option>
                      <option value="sakit-ringan">Sakit Ringan</option>
                      <option value="sakit-berat">Sakit Berat</option>
                      <option value="disabilitas">Disabilitas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterampilan
                    </label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Pisahkan dengan koma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, WEBP. Maksimal 2MB.
                  </p>
                  {formData.profileImage && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-teal-600 font-semibold">Preview:</span>
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Anak
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 font-semibold shadow-sm"
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
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
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
