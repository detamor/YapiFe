import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { donationsService } from '../../services/donations';
import { api } from '../../services/api';
import {
  validateEmail,
  validatePhone,
  validateName,
  sanitizeInput,
} from '../../utils/validation';
import toast from 'react-hot-toast';

const DonationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const childNameParam = searchParams.get('childName') || '';

  const [formData, setFormData] = useState({
    donatorName: '',
    email: '',
    phone: '',
    amount: 0,
    type: 'one-time' as 'one-time' | 'monthly' | 'yearly',
    category: '',
    purpose: '',
    paymentMethod: '',
    isAnonymous: false,
    sponsoredChild: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const finalChildrenList = childrenList;

  useEffect(() => {
    if (childNameParam) {
      const decodedName = decodeURIComponent(childNameParam);
      setFormData((prev) => ({
        ...prev,
        sponsoredChild: decodedName,
        category: 'Pendidikan', // Set to Pendidikan by default if sponsoring
        purpose: `Donasi khusus bersponsor untuk anak asuh bernama ${decodedName}.`,
      }));
    }
  }, [childNameParam]);


  const donationMutation = useMutation({
    mutationFn: donationsService.create,
    onSuccess: () => {
      toast.success('Terima kasih! Donasi Anda telah berhasil dikirim.');
      setFormData({
        donatorName: '',
        email: '',
        phone: '',
        amount: 0,
        type: 'one-time',
        category: '',
        purpose: '',
        paymentMethod: '',
        isAnonymous: false,
        sponsoredChild: '',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'Terjadi kesalahan saat mengirim donasi';
      toast.error(message);
    },
  });

  const predefinedAmounts = [50000, 100000, 250000, 500000, 1000000];

  const categories = [
    'Pendidikan',
    'Kesehatan',
    'Nutrisi',
    'Pakaian',
    'Buku & Alat Tulis',
    'Transportasi',
    'Lainnya',
  ];

  const paymentMethods = [
    'Transfer Bank',
    'E-Wallet',
    'Kartu Kredit/Debit',
    'Cash',
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

    if (formData.amount <= 0) {
      newErrors.amount = 'Jumlah donasi harus lebih dari 0';
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

    // Sanitize input data before sending
    const sanitizedData = {
      ...formData,
      donatorName: sanitizeInput(formData.donatorName),
      purpose: sanitizeInput(formData.purpose),
    };

    donationMutation.mutate(sanitizedData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informasi Donatur
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="donatorName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="donatorName"
                name="donatorName"
                value={formData.donatorName}
                onChange={handleChange}
                className={`input-field ${
                  errors.donatorName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.donatorName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.donatorName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="Masukkan email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="Contoh: 08123456789"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isAnonymous"
                className="ml-2 block text-sm text-gray-700"
              >
                Donasi Anonim
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detail Donasi
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Donasi *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountChange(amount)}
                    className={`p-3 text-sm font-medium rounded-md border transition-colors ${
                      formData.amount === amount
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 text-gray-700 hover:border-indigo-300'
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
                  className={`input-field ${
                    errors.amount
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Atau masukkan jumlah custom"
                  min="1000"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Jenis Donasi
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="one-time">Sekali</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.category
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="sponsoredChild"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sponsori Anak Asuh (Opsional)
              </label>
              <select
                id="sponsoredChild"
                name="sponsoredChild"
                value={formData.sponsoredChild}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Tidak mensponsori anak asuh tertentu</option>
                {finalChildrenList.map((child: any) => (
                  <option key={child._id || child.id} value={child.name}>
                    {child.name}
                  </option>
                ))}
              </select>
              {formData.sponsoredChild && (
                <p className="mt-1 text-xs text-green-600">
                  ✨ Anda mensponsori <strong>{formData.sponsoredChild}</strong>. Donasi Anda akan disalurkan khusus untuk kebutuhan pendukung anak ini.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tujuan Donasi
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Jelaskan tujuan donasi Anda (opsional)"
              />
            </div>

            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Metode Pembayaran *
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className={`input-field ${
                  errors.paymentMethod
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
              >
                <option value="">Pilih metode pembayaran</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentMethod}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Setelah mengirim form ini, tim kami akan menghubungi Anda untuk
                konfirmasi dan instruksi pembayaran lebih lanjut.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={donationMutation.isPending}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {donationMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Mengirim...
              </div>
            ) : (
              'Kirim Donasi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
