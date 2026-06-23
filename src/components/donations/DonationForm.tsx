import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  validateEmail,
  validatePhone,
  validateName,
  sanitizeInput,
} from '../../utils/validation';
import toast from 'react-hot-toast';
import { CheckCircleIcon, CreditCardIcon, InformationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { calculateAge } from '../../utils/dateUtils';

const DonationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const childIdParam = searchParams.get('childId') || '';
  const childNameParam = searchParams.get('childName') || '';
  const categoryParam = searchParams.get('category') || '';

  const [formData, setFormData] = useState({
    donatorName: '',
    email: '',
    phone: '',
    amount: 0,
    type: 'one-time' as 'one-time' | 'monthly' | 'yearly',
    category: '',
    purpose: '',
    paymentMethod: 'midtrans', // default ke pembayaran otomatis
    isAnonymous: false,
    sponsoredChildId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showManualModal, setShowManualModal] = useState(false);
  const [createdManualDonation, setCreatedManualDonation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Midtrans Snap JS dynamically
  useEffect(() => {
    const snapUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = 'SB-Mid-client-uVw2Y3Z4a5b6c7d8'; // client key sandbox

    const existingScript = document.getElementById('midtrans-snap-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = snapUrl;
      script.id = 'midtrans-snap-script';
      script.setAttribute('data-client-key', clientKey);
      document.body.appendChild(script);
    }
  }, []);

  // Fetch children list to populate the dropdown
  const { data: children } = useQuery({
    queryKey: ['children-list-donations'],
    queryFn: async () => {
      const response = await api.get('/children');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Extract children array
  const childrenList = (() => {
    let arr = [];
    if (children?.data && Array.isArray(children.data)) {
      arr = children.data;
    } else if (children?.data && typeof children.data === 'object') {
      arr = children.data.children || children.data.data || [];
    } else if (Array.isArray(children)) {
      arr = children;
    }
    return arr;
  })();

  // Set parameters from URL if present
  useEffect(() => {
    if (childNameParam) {
      const decodedName = decodeURIComponent(childNameParam);
      setFormData((prev) => ({
        ...prev,
        sponsoredChildId: childIdParam,
        category: categoryParam || 'sponsorship',
        purpose: `Donasi sponsorship khusus untuk anak asuh bernama ${decodedName}.`,
      }));
    }
  }, [childNameParam, childIdParam, categoryParam]);

  const predefinedAmounts = [50000, 100000, 250000, 500000, 1000000];

  const categories = [
    { value: 'umum', label: 'Umum / Operasional Panti' },
    { value: 'sponsorship', label: 'Sponsorship Anak Asuh' },
    { value: 'pendidikan', label: 'Beasiswa Pendidikan' },
    { value: 'kesehatan', label: 'Pelayanan Kesehatan' },
    { value: 'makanan', label: 'Pangan & Nutrisi' },
    { value: 'pakaian', label: 'Sandang / Pakaian' },
    { value: 'tempat-tinggal', label: 'Sarana Asrama Asrama' },
    { value: 'kegiatan', label: 'Kegiatan Sosial & Spiritual' }
  ];

  const paymentOptions = [
    { value: 'midtrans', label: 'Pembayaran Otomatis (QRIS / Virtual Account)' },
    { value: 'manual', label: 'Transfer Bank Manual (Proses Verifikasi 1x24 Jam)' }
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmountChange = (amount: number) => {
    setFormData((prev) => ({ ...prev, amount }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.donatorName.trim()) {
      newErrors.donatorName = 'Nama donatur wajib diisi';
    } else if (!validateName(formData.donatorName)) {
      newErrors.donatorName =
        'Nama hanya boleh mengandung huruf, spasi, titik, dan tanda hubung';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (formData.amount < 1000) {
      newErrors.amount = 'Jumlah donasi minimal adalah Rp 1.000';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori donasi wajib dipilih';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Metode pembayaran wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const sanitizedName = sanitizeInput(formData.donatorName);
    const sanitizedPurpose = sanitizeInput(formData.purpose);

    try {
      if (formData.paymentMethod === 'midtrans') {
        // Pemicu pembayaran otomatis via Midtrans Snap
        const response = await api.post('/payments/midtrans/create-transaction', {
          amount: formData.amount,
          donaturInfo: {
            name: sanitizedName,
            email: formData.email,
            phone: formData.phone,
            isAnonymous: formData.isAnonymous
          },
          category: formData.category,
          childId: formData.sponsoredChildId || undefined,
          notes: sanitizedPurpose,
          isRecurring: formData.type !== 'one-time'
        });

        const { snapToken, redirectUrl } = response.data?.data || {};

        if (snapToken) {
          if ((window as any).snap) {
            (window as any).snap.pay(snapToken, {
              onSuccess: function(result: any) {
                toast.success('Pembayaran berhasil!');
                navigate(`/donations/status?order_id=${result.order_id}`);
              },
              onPending: function(result: any) {
                toast.success('Menunggu penyelesaian pembayaran Anda.');
                navigate(`/donations/status?order_id=${result.order_id}`);
              },
              onError: function(result: any) {
                toast.error('Pembayaran gagal diproses.');
                navigate(`/donations/status?order_id=${result.order_id}`);
              },
              onClose: function() {
                toast.error('Pop-up pembayaran ditutup sebelum transaksi selesai.');
              }
            });
          } else {
            toast.success('Mengalihkan ke halaman pembayaran Midtrans...');
            window.location.href = redirectUrl;
          }
        } else {
          throw new Error('Gagal mendapatkan token transaksi dari Midtrans');
        }
      } else {
        // Transfer Bank Manual
        const manualResponse = await api.post('/donations', {
          amount: formData.amount,
          donaturInfo: {
            name: sanitizedName,
            email: formData.email,
            phone: formData.phone,
            isAnonymous: formData.isAnonymous
          },
          category: formData.category,
          paymentMethod: 'bank-transfer',
          purpose: sanitizedPurpose,
          type: formData.type,
          child: formData.sponsoredChildId || undefined
        });

        const donation = manualResponse.data?.data?.donation;
        if (donation) {
          setCreatedManualDonation(donation);
          setShowManualModal(true);
          toast.success('Donasi dicatat! Silakan lakukan transfer bank manual.');
        } else {
          throw new Error('Gagal mencatat donasi manual');
        }
      }
    } catch (error: any) {
      console.error('Submit donation error:', error);
      const message = error.response?.data?.message || error.message || 'Terjadi kesalahan sistem';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseManualModal = () => {
    setShowManualModal(false);
    setFormData({
      donatorName: '',
      email: '',
      phone: '',
      amount: 0,
      type: 'one-time',
      category: '',
      purpose: '',
      paymentMethod: 'midtrans',
      isAnonymous: false,
      sponsoredChildId: '',
    });
    setCreatedManualDonation(null);
  };

  return (
    <div className="max-w-2xl mx-auto font-sans">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Donor Information */}
        <div className="bg-white p-8 rounded-lg border border-parchment-dim shadow-sm">
          <h3 className="text-xl font-bold font-serif text-teal mb-5 border-b border-parchment-dim pb-3">
            Informasi Donatur
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-2">
              <label htmlFor="donatorName" className="block text-sm font-semibold text-teal mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="donatorName"
                name="donatorName"
                value={formData.donatorName}
                onChange={handleChange}
                className={`input-field ${errors.donatorName ? 'border-coral focus:ring-coral focus:border-coral' : ''}`}
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.donatorName && (
                <p className="mt-1 text-xs text-coral font-medium">{errors.donatorName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-teal mb-1">
                Alamat Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-coral focus:ring-coral focus:border-coral' : ''}`}
                placeholder="nama@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-coral font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-teal mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field ${errors.phone ? 'border-coral focus:ring-coral focus:border-coral' : ''}`}
                placeholder="Contoh: 08123456789"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-coral font-medium">{errors.phone}</p>
              )}
            </div>

            <div className="col-span-2 flex items-center pt-2">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-4.5 w-4.5 text-teal focus:ring-teal border-parchment-dim rounded"
              />
              <label htmlFor="isAnonymous" className="ml-2.5 text-sm font-medium text-ink-soft select-none">
                Sembunyikan nama saya dari publik (Donasi Anonim)
              </label>
            </div>
          </div>
        </div>

        {/* Donation Details */}
        <div className="bg-white p-8 rounded-lg border border-parchment-dim shadow-sm">
          <h3 className="text-xl font-bold font-serif text-teal mb-5 border-b border-parchment-dim pb-3">
            Rincian Donasi
          </h3>

          <div className="space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-teal mb-2">
                Pilih Nominal Donasi *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountChange(amount)}
                    className={`p-3 text-xs font-bold rounded-md border transition-all duration-200 ${
                      formData.amount === amount
                        ? 'border-amber bg-amber/10 text-teal shadow-sm'
                        : 'border-parchment-dim text-ink-soft hover:border-amber bg-white'
                    }`}
                  >
                    Rp {amount.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleChange}
                  className={`input-field font-mono font-semibold ${errors.amount ? 'border-coral focus:ring-coral focus:border-coral' : ''}`}
                  placeholder="Atau masukkan jumlah lainnya (Contoh: 150000)"
                  min="1000"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-coral font-medium">{errors.amount}</p>
              )}
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-teal mb-1">
                  Frekuensi Donasi
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field py-2 bg-white"
                >
                  <option value="one-time">Sekali Transfer</option>
                  <option value="monthly">Setiap Bulan</option>
                  <option value="yearly">Setiap Tahun</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-teal mb-1">
                  Kategori Alokasi *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`input-field py-2 bg-white ${errors.category ? 'border-coral focus:ring-coral focus:border-coral' : ''}`}
                >
                  <option value="">-- Pilih kategori --</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-coral font-medium">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Sponsoring a child */}
            <div>
              <label htmlFor="sponsoredChildId" className="block text-sm font-semibold text-teal mb-1">
                Sponsori Anak Asuh Tertentu (Opsional)
              </label>
              <select
                id="sponsoredChildId"
                name="sponsoredChildId"
                value={formData.sponsoredChildId}
                onChange={handleChange}
                className="input-field py-2 bg-white"
              >
                <option value="">-- Donasi untuk Panti Asuhan Umum --</option>
                {childrenList.map((child: any) => (
                  <option key={child._id || child.id} value={child._id || child.id}>
                    {child.name} ({calculateAge(child.dateOfBirth)} tahun)
                  </option>
                ))}
              </select>
              {formData.sponsoredChildId && (
                <div className="mt-2.5 p-3 rounded-md bg-sage/5 border border-sage/20 text-xs text-sage font-medium flex items-center">
                  <span className="mr-1">✨</span>
                  Anda mensponsori anak asuh terpilih. Bantuan ini akan didekasikan penuh untuk sekolah dan perlengkapannya.
                </div>
              )}
            </div>

            {/* Notes / Purpose */}
            <div>
              <label htmlFor="purpose" className="block text-sm font-semibold text-teal mb-1">
                Pesan Khusus / Doa (Opsional)
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Tulis doa atau pesan khusus Anda untuk anak-anak asuh..."
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-sm font-semibold text-teal mb-2">
                Metode Pembayaran *
              </label>
              <div className="space-y-2">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.paymentMethod === opt.value
                        ? 'border-teal bg-teal/5 text-teal font-semibold'
                        : 'border-parchment-dim hover:border-teal/30 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={formData.paymentMethod === opt.value}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-teal focus:ring-teal border-gray-300"
                    />
                    <div className="ml-3 text-xs leading-normal">
                      <span className="block text-sm font-bold text-teal">{opt.label}</span>
                      {opt.value === 'midtrans' ? (
                        <span className="block text-ink-soft mt-0.5">
                          Bayar instan via Gopay, ShopeePay, OVO, QRIS apa saja, atau Mandiri/BCA/BRI Virtual Account.
                        </span>
                      ) : (
                        <span className="block text-ink-soft mt-0.5">
                          Melakukan transfer ATM manual dan melakukan konfirmasi bukti transfer secara manual.
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-xs text-coral font-medium">{errors.paymentMethod}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-parchment-dim shadow-xs flex items-start transition-all">
          <ShieldCheckIcon className="w-5 h-5 text-sage mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-ink-soft leading-relaxed">
            {formData.paymentMethod === 'midtrans' ? (
              <p>
                Tombol <strong className="text-teal">Bayar Otomatis</strong> di bawah akan membuka modul pembayaran aman Midtrans (QRIS, E-Wallet, VA). Donasi Anda akan langsung terverifikasi secara otomatis oleh sistem.
              </p>
            ) : (
              <p>
                Tombol <strong className="text-teal">Kirim Donasi</strong> di bawah akan memberikan instruksi transfer rekening bank Mandiri dan mendaftarkan kuitansi pending untuk diverifikasi secara manual oleh pengurus.
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-accent px-8 py-3.5 text-lg shadow-sm hover-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ink mr-2.5"></div>
                Memproses...
              </>
            ) : formData.paymentMethod === 'midtrans' ? (
              <>
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Bayar Otomatis
              </>
            ) : (
              'Kirim Donasi'
            )}
          </button>
        </div>
      </form>

      {/* Manual Payment Instructions Modal */}
      {showManualModal && createdManualDonation && (
        <div className="fixed inset-0 bg-teal/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg border border-parchment-dim shadow-xl max-w-md w-full p-8 relative overflow-hidden animate-zoom-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber"></div>
            
            <div className="text-center mb-6">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-sage mb-2" />
              <h4 className="text-xl font-bold font-serif text-teal">Pendaftaran Donasi Manual</h4>
              <p className="text-xs text-ink-soft mt-1">
                Donasi Anda berhasil dicatat dengan nomor kuitansi pending:
              </p>
              <span className="block mt-2 font-mono font-bold text-sm text-teal bg-parchment py-1.5 px-3 rounded inline-block">
                {createdManualDonation.receiptNumber}
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans border-t border-b border-parchment-dim py-5 my-5">
              <p className="text-center font-semibold text-teal mb-3 text-sm">
                Silakan lakukan transfer senilai:
              </p>
              <div className="text-center text-2xl font-bold font-mono text-teal bg-parchment-dim py-2.5 rounded-md">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(createdManualDonation.amount)}
              </div>
              
              <div className="mt-4 space-y-2 text-ink">
                <div className="flex justify-between border-b border-parchment-dim pb-1.5">
                  <span className="text-ink-soft">Nama Bank</span>
                  <span className="font-bold">Bank Mandiri</span>
                </div>
                <div className="flex justify-between border-b border-parchment-dim pb-1.5">
                  <span className="text-ink-soft">Nomor Rekening</span>
                  <span className="font-bold font-mono">123-456-789-0123</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-ink-soft">Atas Nama</span>
                  <span className="font-bold">Yayasan Advent Peduli Indonesia</span>
                </div>
              </div>

              <div className="p-3 bg-teal/5 border border-teal/10 rounded text-[11px] leading-relaxed text-ink-soft mt-4">
                💡 <strong>PENTING:</strong> Mohon transfer dengan nominal persis. Setelah transfer, kirim bukti transfer ke Whatsapp pengurus panti di <strong>0813-7058-0833</strong> untuk verifikasi manual.
              </div>
            </div>

            <button
              onClick={handleCloseManualModal}
              className="w-full py-3 bg-teal hover:bg-teal-light text-parchment font-bold text-center rounded-md transition-colors"
            >
              Saya Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationForm;
