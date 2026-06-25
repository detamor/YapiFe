import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationsService } from '../../services/donations';
import toast from 'react-hot-toast';

const DonationsManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const queryClient = useQueryClient();

  // Fetch donations
  const { data, isLoading, error } = useQuery({
    queryKey: ['donations', page, statusFilter, categoryFilter, searchQuery],
    queryFn: () =>
      donationsService.getAll({
        page,
        limit: 10,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        // The service takes params, search can be passed or custom queries.
        // Let's pass them as query params in URL.
      } as any),
    keepPreviousData: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      donationsService.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['donations-report'] });
      toast.success('Status donasi berhasil diupdate!');
      setIsModalOpen(false);
      setSelectedDonation(null);
    },
    onError: (err: any) => {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Gagal mengupdate status donasi');
    },
  });

  const handleOpenStatusModal = (donation: any) => {
    setSelectedDonation(donation);
    setNewStatus(donation.status);
    setAdminNotes(donation.adminNotes || '');
    setIsModalOpen(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonation) return;

    updateStatusMutation.mutate({
      id: selectedDonation._id,
      status: newStatus,
      notes: adminNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      verified: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
          badges[status] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  // Safe donations array extract
  const donationsList = (data as any)?.data?.donations || [];
  const pagination = (data as any)?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Donasi</h1>
          <p className="mt-2 text-gray-600">
            Lihat, kelola, dan verifikasi riwayat donasi masuk dari para donatur.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Status
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
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Kategori</option>
              <option value="pendidikan">Pendidikan</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="nutrisi">Nutrisi</option>
              <option value="umum">Umum</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pencarian (Manual)
            </label>
            <input
              type="text"
              placeholder="Cari donasi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 font-medium">
              Gagal memuat data donasi. Error: {(error as any).message}
            </div>
          ) : donationsList.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              Tidak ada data donasi yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Donatur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tipe/Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Metode Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donationsList.map((donation: any) => {
                    const donorName = donation.donatur?.name || donation.donaturInfo?.name || 'Anonim';
                    const donorEmail = donation.donatur?.email || donation.donaturInfo?.email || '-';
                    const amountText = (donation.amount || 0).toLocaleString('id-ID');
                    let dateText = 'Tidak ada tanggal';
                    if (donation.createdAt) {
                      try {
                        const parsedDate = new Date(donation.createdAt);
                        if (!isNaN(parsedDate.getTime())) {
                          dateText = parsedDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          });
                        }
                      } catch (e) {
                        dateText = donation.createdAt;
                      }
                    }

                    return (
                      <tr key={donation._id || donation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{donorName}</span>
                            <span className="text-xs text-gray-500">{donorEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            Rp {amountText}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-800 capitalize">
                              {donation.type === 'one-time' ? 'Sekali Bayar' : donation.type}
                            </span>
                            <span className="text-xs text-indigo-600 capitalize font-medium">
                              {donation.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600 uppercase font-medium">
                            {donation.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {dateText}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(donation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenStatusModal(donation)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition-colors"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Menampilkan Halaman <span className="font-medium">{pagination.currentPage}</span> dari{' '}
                    <span className="font-medium">{pagination.totalPages}</span> (<span className="font-medium">{pagination.totalItems}</span> donasi)
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span>Sebelumnya</span>
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
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span>Selanjutnya</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {isModalOpen && selectedDonation && (
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
                  Update Status Donasi
                </h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4 text-sm text-gray-600">
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-gray-700">Donatur:</span>
                    <span>{selectedDonation.donatur?.name || selectedDonation.donaturInfo?.name || 'Anonim'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-gray-700">Jumlah:</span>
                    <span className="font-bold text-gray-950">
                      Rp {selectedDonation.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-gray-700">Metode:</span>
                    <span className="uppercase">{selectedDonation.paymentMethod}</span>
                  </div>
                  {selectedDonation.receiptNumber && (
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-gray-700">No. Kwitansi:</span>
                      <span className="font-mono text-xs">{selectedDonation.receiptNumber}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveStatus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Donasi
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified (Manual)</option>
                      <option value="completed">Completed (Selesai/Sukses)</option>
                      <option value="failed">Failed (Gagal)</option>
                      <option value="cancelled">Cancelled (Batal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan Admin
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Masukkan alasan perubahan status atau catatan verifikasi donasi..."
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
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-colors text-sm disabled:opacity-50"
                    >
                      {updateStatusMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
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

export default DonationsManagementPage;
