import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsService } from '../../services/testimonials';
import toast from 'react-hot-toast';

const TestimonialsManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(''); // Default empty shows all for admin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');

  const queryClient = useQueryClient();

  // Fetch testimonials
  const { data, isLoading, error } = useQuery({
    queryKey: ['testimonials', page, statusFilter],
    queryFn: () =>
      testimonialsService.getAll({
        page,
        limit: 10,
        status: statusFilter || undefined,
      }),
    keepPreviousData: true,
  });

  // Moderation mutation
  const moderateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: 'approved' | 'rejected';
      notes?: string;
    }) => testimonialsService.moderate(id, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(
        `Testimoni berhasil ${variables.status === 'approved' ? 'disetujui' : 'ditolak'}!`
      );
      setIsModalOpen(false);
      setSelectedTestimonial(null);
      setModerationNotes('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal memoderasi testimoni');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Testimoni berhasil dihapus!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus testimoni');
    },
  });

  const handleOpenModerateModal = (testimonial: any, type: 'approved' | 'rejected') => {
    setSelectedTestimonial(testimonial);
    setActionType(type);
    setModerationNotes(testimonial.moderationNotes || '');
    setIsModalOpen(true);
  };

  const handleSaveModeration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestimonial) return;

    moderateMutation.mutate({
      id: selectedTestimonial._id,
      status: actionType,
      notes: moderationNotes,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus testimoni ini secara permanen?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span
        className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
          badges[status] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  // Safe data extraction
  const testimonialsList = data?.data?.items || (data as any)?.data?.testimonials || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Moderasi Testimoni</h1>
          <p className="mt-2 text-gray-600">
            Setujui atau tolak testimoni yang dikirimkan oleh donatur, relawan, panti alumni, maupun pengunjung umum.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Status Moderasi
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu Moderasi (Pending)</option>
              <option value="approved">Disetujui (Approved)</option>
              <option value="rejected">Ditolak (Rejected)</option>
            </select>
          </div>
          <div className="mt-4 sm:mt-0 text-sm text-gray-500 font-medium">
            Total testimoni: <span className="text-gray-800 font-bold">{pagination.totalItems}</span>
          </div>
        </div>

        {/* Testimonials List */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500 font-medium bg-white rounded-lg shadow border border-gray-200">
            Gagal memuat data testimoni. Error: {(error as any).message}
          </div>
        ) : testimonialsList.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-white rounded-lg shadow border border-gray-200">
            Tidak ada data testimoni yang ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {testimonialsList.map((item: any) => {
              let dateText = 'Tidak ada tanggal';
              if (item.createdAt) {
                try {
                  const parsedDate = new Date(item.createdAt);
                  if (!isNaN(parsedDate.getTime())) {
                    dateText = parsedDate.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    });
                  }
                } catch (e) {
                  dateText = item.createdAt;
                }
              }

              const ratingVal = Math.max(0, Math.min(5, item.rating || 5));

              return (
                <div
                  key={item._id || item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      {getStatusBadge(item.status)}
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 capitalize font-semibold">
                        {item.type || 'Pengunjung'}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm italic mb-4">
                      "{item.content}"
                    </p>

                    <div className="flex items-center text-xs text-gray-500 font-sans gap-2 flex-wrap">
                      <span className="font-semibold text-gray-700">
                        Oleh: {item.author?.name || 'Anonim'}
                      </span>
                      {item.author?.occupation && (
                        <span>• {item.author.occupation}</span>
                      )}
                      <span>• {dateText}</span>
                      <span className="ml-2 flex items-center text-yellow-500 font-semibold">
                        {'★'.repeat(ratingVal)}
                        {'☆'.repeat(5 - ratingVal)}
                        <span className="ml-1 text-gray-700">({ratingVal}/5)</span>
                      </span>
                    </div>

                    {item.moderationNotes && (
                      <div className="mt-3 bg-red-50/50 border border-red-100 rounded p-3 text-xs text-red-800">
                        <span className="font-bold">Catatan Moderasi:</span> {item.moderationNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col justify-end gap-2 md:w-44 flex-shrink-0">
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleOpenModerateModal(item, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded shadow-sm transition-colors"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleOpenModerateModal(item, 'rejected')}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 px-3 rounded shadow-sm transition-colors"
                        >
                          Tolak
                        </button>
                      </>
                    )}

                    {item.status !== 'pending' && (
                      <button
                        onClick={() =>
                          handleOpenModerateModal(
                            item,
                            item.status === 'approved' ? 'rejected' : 'approved'
                          )
                        }
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded border border-gray-300 transition-colors"
                      >
                        Ubah Moderasi
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold py-2 px-3 rounded transition-colors"
                    >
                      Hapus Permanen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === i + 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Moderation Notes Modal */}
      {isModalOpen && selectedTestimonial && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4" id="modal-title">
                  Moderasi Testimoni: {actionType === 'approved' ? 'Setujui' : 'Tolak'}
                </h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4 text-sm text-gray-600 italic">
                  "{selectedTestimonial.content}"
                </div>

                <form onSubmit={handleSaveModeration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan Moderasi (Opsional)
                    </label>
                    <textarea
                      value={moderationNotes}
                      onChange={(e) => setModerationNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Masukkan alasan atau catatan mengenai keputusan moderasi ini..."
                    ></textarea>
                  </div>

                  <div className="mt-5 sm:mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-md transition-colors text-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={moderateMutation.isPending}
                      className={`flex-1 text-white font-medium py-2 rounded-md transition-colors text-sm disabled:opacity-50 ${
                        actionType === 'approved'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      {moderateMutation.isPending ? 'Menyimpan...' : 'Simpan Keputusan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagementPage;
