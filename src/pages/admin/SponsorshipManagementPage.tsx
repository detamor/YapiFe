import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { calculateAge } from '../../utils/dateUtils';
import { UserPlusIcon, UserMinusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SponsorshipManagementPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [modalForm, setModalForm] = useState({
    sponsorEmail: '',
    sponsorshipType: 'penuh',
    monthlyAmount: 500000,
    startDate: new Date().toISOString().split('T')[0]
  });
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchSponsorships = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/admin/sponsorships', { params });
      setChildren(response.data?.data?.children || []);
    } catch (err: any) {
      console.error('Failed to fetch sponsorships:', err);
      toast.error('Gagal mengambil data sponsorship');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, [search, statusFilter]);

  const handleEndSponsorship = async (childId: string, childName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin mengakhiri hubungan sponsor untuk ${childName}?`)) {
      return;
    }

    try {
      const response = await api.put(`/admin/sponsorships/${childId}/end`);
      if (response.data?.success) {
        toast.success(`Sponsorship untuk ${childName} berhasil diakhiri.`);
        fetchSponsorships();
      }
    } catch (err: any) {
      console.error('Failed to end sponsorship:', err);
      const msg = err.response?.data?.message || 'Gagal menonaktifkan sponsor';
      toast.error(msg);
    }
  };

  const handleOpenAssignModal = (child: any) => {
    setSelectedChild(child);
    setModalForm({
      sponsorEmail: child.sponsorship?.sponsor?.email || '',
      sponsorshipType: child.sponsorship?.sponsorshipType || 'penuh',
      monthlyAmount: child.sponsorship?.monthlyAmount || 500000,
      startDate: (() => {
        if (child.sponsorship?.startDate) {
          try {
            const d = new Date(child.sponsorship.startDate);
            if (!isNaN(d.getTime())) {
              return d.toISOString().split('T')[0];
            }
          } catch (e) {}
        }
        return new Date().toISOString().split('T')[0];
      })()
    });
    setIsModalOpen(true);
  };

  const handleAssignSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.sponsorEmail.trim()) {
      toast.error('Email donatur harus diisi');
      return;
    }

    setIsAssigning(true);
    try {
      const response = await api.put(`/admin/sponsorships/${selectedChild._id}/assign`, {
        sponsorEmail: modalForm.sponsorEmail.trim(),
        sponsorshipType: modalForm.sponsorshipType,
        monthlyAmount: modalForm.monthlyAmount,
        startDate: modalForm.startDate
      });

      if (response.data?.success) {
        toast.success(`Sponsor berhasil ditetapkan untuk ${selectedChild.name}.`);
        setIsModalOpen(false);
        fetchSponsorships();
      }
    } catch (err: any) {
      console.error('Failed to assign sponsor:', err);
      const msg = err.response?.data?.message || 'Gagal menetapkan sponsor. Pastikan email terdaftar.';
      toast.error(msg);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-teal">Kelola Sponsorship Anak</h1>
          <p className="mt-2 text-ink-soft text-sm">
            Menugaskan donatur secara manual sebagai sponsor tetap anak asuh panti asuhan YAPI Medan.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 border border-parchment-dim shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-ink-soft mb-1 uppercase tracking-wider">Cari Anak</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama anak..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-ink-soft absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-xs font-semibold text-ink-soft mb-1 uppercase tracking-wider">Status Sponsor</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field bg-white py-2"
            >
              <option value="">Semua</option>
              <option value="sponsored">Disponsori</option>
              <option value="unsponsored">Belum Disponsori</option>
            </select>
          </div>
        </div>

        {/* Weave Divider */}
        <div className="weave-divider mb-6"></div>

        {/* Children & Sponsorship Table */}
        <div className="bg-white rounded-lg border border-parchment-dim shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal mx-auto mb-3"></div>
              <p className="text-ink-soft text-sm">Memuat data sponsorship...</p>
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-soft italic text-sm">Tidak ditemukan data anak asuh.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-parchment-dim text-left text-sm">
                <thead className="bg-parchment-dim/40 text-teal font-semibold font-serif">
                  <tr>
                    <th scope="col" className="px-6 py-4">Anak Asuh</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Sponsor Aktif</th>
                    <th scope="col" className="px-6 py-4">Tipe & Jumlah</th>
                    <th scope="col" className="px-6 py-4">Mulai Sponsor</th>
                    <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment-dim text-ink font-sans">
                  {children.map((child) => {
                    const isSponsored = child.sponsorship?.isSponsored;
                    const sponsor = child.sponsorship?.sponsor;
                    const mainImage = child.images?.[0]?.url || child.profileImage || '';
                    
                    return (
                      <tr key={child._id || child.id} className="hover:bg-parchment/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 border border-parchment-dim">
                              <img
                                src={!mainImage ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' : (mainImage.startsWith('http') || mainImage.startsWith('/') ? mainImage : `/uploads/${mainImage}`)}
                                alt={child.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-bold text-teal font-serif">{child.name}</div>
                              <div className="text-xs text-ink-soft">{calculateAge(child.dateOfBirth)} tahun</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isSponsored 
                              ? 'bg-sage/10 text-sage' 
                              : 'bg-coral/10 text-coral'
                          }`}>
                            {isSponsored ? 'Disponsori' : 'Butuh Sponsor'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isSponsored && sponsor ? (
                            <div>
                              <div className="font-semibold text-teal">{sponsor.name}</div>
                              <div className="text-xs text-ink-soft">{sponsor.email}</div>
                              {sponsor.phone && <div className="text-xs text-ink-soft font-mono mt-0.5">{sponsor.phone}</div>}
                            </div>
                          ) : (
                            <span className="text-ink-soft italic text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isSponsored ? (
                            <div>
                              <div className="capitalize font-medium">{child.sponsorship.sponsorshipType}</div>
                              <div className="text-xs font-mono text-teal font-semibold">
                                {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  maximumFractionDigits: 0
                                }).format(child.sponsorship.monthlyAmount)} /bln
                              </div>
                            </div>
                          ) : (
                            <span className="text-ink-soft italic text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                          {isSponsored && child.sponsorship.startDate ? (
                            (() => {
                              try {
                                const parsedDate = new Date(child.sponsorship.startDate);
                                if (!isNaN(parsedDate.getTime())) {
                                  return parsedDate.toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  });
                                }
                              } catch (e) {}
                              return child.sponsorship.startDate;
                            })()
                          ) : (
                            <span className="text-ink-soft italic text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2">
                          <button
                            onClick={() => handleOpenAssignModal(child)}
                            className="inline-flex items-center px-3 py-1.5 bg-teal text-parchment hover:bg-teal-light rounded transition-colors font-bold"
                          >
                            <UserPlusIcon className="w-4 h-4 mr-1" />
                            {isSponsored ? 'Ubah' : 'Tugaskan'}
                          </button>
                          {isSponsored && (
                            <button
                              onClick={() => handleEndSponsorship(child._id, child.name)}
                              className="inline-flex items-center px-3 py-1.5 bg-coral text-white hover:bg-red-600 rounded transition-colors font-bold"
                            >
                              <UserMinusIcon className="w-4 h-4 mr-1" />
                              Akhiri
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Manual Assign Sponsor Modal */}
      {isModalOpen && selectedChild && (
        <div className="fixed inset-0 bg-teal/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg border border-parchment-dim shadow-xl max-w-md w-full p-8 relative overflow-hidden animate-zoom-in">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-ink-soft hover:text-teal p-1 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="absolute top-0 left-0 right-0 h-1.5 bg-teal"></div>

            <div className="mb-6">
              <h3 className="text-xl font-bold font-serif text-teal">Tugaskan Sponsor</h3>
              <p className="text-xs text-ink-soft mt-1">
                Menghubungkan donatur terdaftar secara manual ke anak asuh:
              </p>
              <span className="block mt-2 font-serif font-bold text-sm text-teal bg-parchment py-1 px-3 rounded inline-block">
                {selectedChild.name}
              </span>
            </div>

            <form onSubmit={handleAssignSponsor} className="space-y-4">
              
              <div>
                <label htmlFor="sponsorEmail" className="block text-xs font-semibold text-teal mb-1 uppercase tracking-wider">
                  Email Donatur Terdaftar *
                </label>
                <input
                  id="sponsorEmail"
                  type="email"
                  required
                  placeholder="donatur@email.com"
                  value={modalForm.sponsorEmail}
                  onChange={(e) => setModalForm(prev => ({ ...prev, sponsorEmail: e.target.value }))}
                  className="input-field text-sm"
                />
                <p className="mt-1 text-[10px] text-ink-soft leading-relaxed">
                  ⚠️ Donatur harus sudah mendaftar akun di website YAPI terlebih dahulu.
                </p>
              </div>

              <div>
                <label htmlFor="sponsorshipType" className="block text-xs font-semibold text-teal mb-1 uppercase tracking-wider">
                  Jenis Hubungan Sponsor
                </label>
                <select
                  id="sponsorshipType"
                  value={modalForm.sponsorshipType}
                  onChange={(e) => setModalForm(prev => ({ ...prev, sponsorshipType: e.target.value }))}
                  className="input-field text-sm bg-white py-1.5"
                >
                  <option value="penuh">Penuh (Biaya Hidup & Sekolah)</option>
                  <option value="sebagian">Sebagian</option>
                  <option value="pendidikan">Pendidikan Saja</option>
                  <option value="kesehatan">Kesehatan Saja</option>
                  <option value="kebutuhan-harian">Kebutuhan Harian</option>
                </select>
              </div>

              <div>
                <label htmlFor="monthlyAmount" className="block text-xs font-semibold text-teal mb-1 uppercase tracking-wider">
                  Nominal Dukungan Bulanan (Rp)
                </label>
                <input
                  id="monthlyAmount"
                  type="number"
                  required
                  min="0"
                  value={modalForm.monthlyAmount}
                  onChange={(e) => setModalForm(prev => ({ ...prev, monthlyAmount: parseInt(e.target.value) || 0 }))}
                  className="input-field font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-xs font-semibold text-teal mb-1 uppercase tracking-wider">
                  Tanggal Mulai
                </label>
                <input
                  id="startDate"
                  type="date"
                  required
                  value={modalForm.startDate}
                  onChange={(e) => setModalForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input-field text-sm font-mono"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-parchment-dim text-ink-soft text-sm font-bold rounded-md hover:bg-parchment-dim/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="flex-1 py-2.5 bg-teal hover:bg-teal-light text-parchment text-sm font-bold rounded-md transition-colors disabled:opacity-50"
                >
                  {isAssigning ? 'Memproses...' : 'Simpan Tugas'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorshipManagementPage;
