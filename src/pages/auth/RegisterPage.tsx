import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  validateEmail,
  validatePhone,
  validatePassword,
} from '../../utils/validation';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import SocialLogin from '../../components/auth/SocialLogin';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else {
      const passwordResult = validatePassword(formData.password);
      if (!passwordResult.isValid) {
        newErrors.password = passwordResult.message;
      }
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Registrasi berhasil! Selamat datang di YAPI Medan.');
      navigate('/');
    } catch (error: any) {
      let message = error.response?.data?.message || 'Terjadi kesalahan saat registrasi';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
        message = `${message}: ${error.response.data.errors[0].message}`;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            src="/yapi.jpg"
            alt="YAPI Medan Logo"
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Daftar Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Atau{' '}
          <Link
            to="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sudah punya akun? Masuk di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Masukkan email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Nomor Telepon <span className="text-gray-500">(Opsional)</span>
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Contoh: 08123456789"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pr-10 ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Konfirmasi Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`input-field pr-10 ${
                    errors.password_confirmation
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mendaftar...
                  </div>
                ) : (
                  'Daftar'
                )}
              </button>
            </div>
          </form>

          <SocialLogin />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Dengan mendaftar, Anda menyetujui
                </span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <Link
                to="/terms"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link
                to="/privacy"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
