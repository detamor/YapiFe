import React, { useState } from 'react';
import { validateEmail } from '../../utils/validation';
import toast from 'react-hot-toast';

interface TestimonialFormData {
  name: string;
  email: string;
  role: string;
  message: string;
}

interface TestimonialFormProps {
  onSuccess?: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    email: '',
    role: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Pilih peran Anda';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Testimoni wajib diisi';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Testimoni minimal 20 karakter';
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

    try {
      // Simulasi pengiriman testimoni (nanti bisa diintegrasikan dengan API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        'Terima kasih! Testimoni Anda telah berhasil dikirim dan akan ditinjau oleh tim kami.'
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        message: '',
      });
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        'Terjadi kesalahan saat mengirim testimoni. Silakan coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Bagikan Pengalaman Anda
      </h3>
      <p className="text-gray-600 mb-6">
        Apakah Anda pernah berinteraksi dengan YAPI Medan? Bagikan pengalaman
        dan testimoni Anda untuk membantu orang lain memahami dampak program
        YAPI Medan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Peran Anda *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Pilih peran Anda</option>
            <option value="donatur">Donatur</option>
            <option value="penerima-manfaat">
              Penerima Manfaat (Anak YAPI)
            </option>
            <option value="volunteer">Volunteer</option>
            <option value="mitra">Mitra/Partner</option>
            <option value="lainnya">Lainnya</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Testimoni *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Bagikan pengalaman Anda dengan YAPI Medan (minimal 20 karakter)"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.message.length}/500 karakter
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Testimoni'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Testimoni akan ditinjau oleh tim kami sebelum ditampilkan di website.
      </div>
    </div>
  );
};

export default TestimonialForm;
