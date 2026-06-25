import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Activity {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: 'pendidikan' | 'kesehatan' | 'olahraga' | 'seni-budaya' | 'keterampilan' | 'sosial' | 'rekreasi' | 'keagamaan' | 'lingkungan' | 'lainnya';
  type: 'rutin' | 'khusus' | 'event' | 'workshop' | 'kompetisi' | 'kunjungan';
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  schedule: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  };
  location: {
    name: string;
    address: string;
  };
  isPublic: boolean;
  isFeatured: boolean;
  media?: {
    images: Array<{
      url: string;
      caption: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

const ActivitiesManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pendidikan' as 'pendidikan' | 'kesehatan' | 'olahraga' | 'seni-budaya' | 'keterampilan' | 'sosial' | 'rekreasi' | 'keagamaan' | 'lingkungan' | 'lainnya',
    type: 'rutin' as 'rutin' | 'khusus' | 'event' | 'workshop' | 'kompetisi' | 'kunjungan',
    status: 'planned' as 'planned' | 'ongoing' | 'completed' | 'cancelled' | 'postponed',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    isPublic: true,
    isFeatured: false,
    imageUrl: '',
    imageCaption: '',
    imageFile: null as File | null,
  });

  const queryClient = useQueryClient();

  // Fetch activities data
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await api.get('/activities');
      return response.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Create/Update activity mutation
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingActivity) {
        return api.put(`/activities/${editingActivity._id || editingActivity.id}`, data);
      } else {
        return api.post('/activities', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success(
        editingActivity
          ? 'Kegiatan berhasil diupdate!'
          : 'Kegiatan berhasil ditambahkan!'
      );
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan!');
    },
  });

  // Delete activity mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Kegiatan berhasil dihapus!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus kegiatan!');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'pendidikan',
      type: 'rutin',
      status: 'planned',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      locationName: '',
      locationAddress: '',
      isPublic: true,
      isFeatured: false,
      imageUrl: '',
      imageCaption: '',
      imageFile: null,
    });
    setEditingActivity(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schedule = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
    };

    const location = {
      name: formData.locationName,
      address: formData.locationAddress,
    };

    if (formData.imageFile) {
      const formDataWithFile = new FormData();
      formDataWithFile.append('image', formData.imageFile);
      formDataWithFile.append('title', formData.title);
      formDataWithFile.append('description', formData.description);
      formDataWithFile.append('category', formData.category);
      formDataWithFile.append('type', formData.type);
      formDataWithFile.append('status', formData.status);
      formDataWithFile.append('schedule', JSON.stringify(schedule));
      formDataWithFile.append('location', JSON.stringify(location));
      formDataWithFile.append('isPublic', formData.isPublic.toString());
      formDataWithFile.append('isFeatured', formData.isFeatured.toString());
      formDataWithFile.append('imageCaption', formData.imageCaption || formData.title || '');
      formDataWithFile.append('approvalStatus', 'approved');

      mutation.mutate(formDataWithFile);
    } else {
      const data = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        status: formData.status,
        schedule,
        location,
        isPublic: formData.isPublic,
        isFeatured: formData.isFeatured,
        media: {
          images: formData.imageUrl
            ? [{ url: formData.imageUrl, caption: formData.imageCaption || '' }]
            : [],
        },
        approvalStatus: 'approved'
      };
      mutation.mutate(data);
    }
  };

  const handleEdit = (activity: Activity) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
        return new Date(dateStr).toISOString().split('T')[0];
      } catch (err) {
        return dateStr;
      }
    };

    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      category: activity.category,
      type: activity.type,
      status: activity.status,
      startDate: formatDate(activity.schedule?.startDate),
      endDate: formatDate(activity.schedule?.endDate),
      startTime: activity.schedule?.startTime || '',
      endTime: activity.schedule?.endTime || '',
      locationName: activity.location?.name || '',
      locationAddress: activity.location?.address || '',
      isPublic: activity.isPublic,
      isFeatured: activity.isFeatured,
      imageUrl: activity.media?.images?.[0]?.url || '',
      imageCaption: activity.media?.images?.[0]?.caption || '',
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-teal-100 text-teal-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Rencana / Terjadwal';
      case 'ongoing':
        return 'Sedang Berlangsung';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'postponed':
        return 'Ditunda';
      default:
        return status;
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
              Kelola Kegiatan
            </h1>
            <p className="mt-2 text-gray-600">
              Tambah, edit, dan kelola kegiatan YAPI Medan
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            + Tambah Kegiatan
          </button>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Kegiatan
            </h2>
          </div>

          {!activities?.data?.activities || activities.data.activities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Belum ada kegiatan yang ditambahkan.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activities.data.activities.map((activity: Activity) => {
                const imageUrl = activity.media?.images?.[0]?.url;
                const displayImage = imageUrl
                  ? imageUrl.startsWith('http') || imageUrl.startsWith('/')
                    ? imageUrl
                    : `/uploads/${imageUrl}`
                  : null;

                return (
                  <div key={activity._id || activity.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-4">
                      {displayImage && (
                        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={displayImage}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {activity.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {getStatusText(activity.status)}
                          </span>
                          {activity.isFeatured && (
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {activity.description}
                        </p>

                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            📅{' '}
                            {activity.schedule?.startDate ? (
                              (() => {
                                try {
                                  return new Date(activity.schedule.startDate).toLocaleDateString('id-ID');
                                } catch (e) {
                                  return activity.schedule.startDate;
                                }
                              })()
                            ) : (
                              'Tidak ada tanggal'
                            )}
                          </span>
                          <span>📍 {activity.location?.name || 'Tidak ada lokasi'}</span>
                          <span>🏷️ {activity.category || '-'}</span>
                          <span>📋 {activity.type || '-'}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(activity._id || activity.id || '')}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {editingActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Kegiatan
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as any })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      required
                    >
                      <option value="pendidikan">Pendidikan</option>
                      <option value="kesehatan">Kesehatan</option>
                      <option value="olahraga">Olahraga</option>
                      <option value="seni-budaya">Seni & Budaya</option>
                      <option value="keterampilan">Keterampilan</option>
                      <option value="sosial">Sosial</option>
                      <option value="rekreasi">Rekreasi</option>
                      <option value="keagamaan">Keagamaan</option>
                      <option value="lingkungan">Lingkungan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipe Kegiatan
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="rutin">Rutin</option>
                      <option value="khusus">Khusus</option>
                      <option value="event">Event</option>
                      <option value="workshop">Workshop</option>
                      <option value="kompetisi">Kompetisi</option>
                      <option value="kunjungan">Kunjungan</option>
                    </select>
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
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="planned">Terjadwal / Rencana</option>
                      <option value="ongoing">Sedang Berlangsung</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                      <option value="postponed">Ditunda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Mulai (Opsional)
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Selesai (Opsional)
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.locationName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          locationName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Contoh: Gedung YAPI Medan"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.locationAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          locationAddress: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Alamat lengkap lokasi"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Foto Kegiatan (Opsional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, imageFile: file });
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, WEBP. Maksimal 2MB.
                    </p>
                    {formData.imageFile && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-teal-600 font-semibold">Preview:</span>
                        <img
                          src={URL.createObjectURL(formData.imageFile)}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Atau URL Foto Dokumentasi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Contoh: /images/activities/yapi1.webp atau URL gambar"
                      disabled={formData.imageFile !== null}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Diabaikan jika mengunggah file di sebelah kiri.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan Foto Dokumentasi (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.imageCaption}
                    onChange={(e) =>
                      setFormData({ ...formData, imageCaption: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Keterangan singkat tentang foto ini"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublic: e.target.checked })
                      }
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Publik</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {mutation.isPending
                      ? 'Menyimpan...'
                      : editingActivity
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

export default ActivitiesManagementPage;






