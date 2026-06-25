import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  LockClosedIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Nama lengkap tidak boleh kosong');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
      });
      toast.success('Profil berhasil diperbarui!');
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Gagal memperbarui profil'
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Semua kolom password wajib diisi');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password baru minimal harus 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password baru tidak cocok');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success('Password berhasil diubah!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Gagal mengubah password'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Format Join Date
  const getJoinDate = () => {
    if (!user) return '-';
    const dateObj = (user as any).createdAt || (user as any).approvedAt || (user as any).lastLogin;
    if (!dateObj) return 'Baru-baru ini';
    return new Date(dateObj).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal/10 text-teal border border-teal/20 font-sans">
            Administrator
          </span>
        );
      case 'volunteer':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-sans">
            Relawan / Volunteer
          </span>
        );
      case 'donatur':
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber/10 text-amber border border-amber/20 font-sans">
            Donatur
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-parchment-dim py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Weave Divider Top decoration */}
        <div className="weave-divider mb-8 rounded-full overflow-hidden" />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-teal font-bold mb-2">
            Profil Saya
          </h1>
          <p className="text-sm sm:text-base text-ink/70">
            Kelola detail profil pribadi Anda dan ganti kata sandi akun Anda di sini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="card bg-white p-6 flex flex-col items-center text-center shadow-sm border border-parchment-dim">
              {/* Profile Image / Initials Avatar */}
              <div className="relative mb-4 group">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-28 h-28 object-cover rounded-full border-4 border-teal shadow-inner"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-teal to-teal-light flex items-center justify-center border-4 border-white shadow-md">
                    <span className="text-4xl font-serif font-bold text-parchment">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-teal text-parchment p-1.5 rounded-full shadow border-2 border-white">
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
              </div>

              {/* User Identity */}
              <h2 className="text-xl font-serif font-bold text-teal mb-1">
                {user?.name}
              </h2>
              <p className="text-xs text-ink/50 mb-3 break-all">{user?.email}</p>
              
              <div className="mb-5">{getRoleBadge(user?.role)}</div>

              <div className="w-full weave-divider my-2 opacity-50" />

              {/* Quick Info Items */}
              <div className="w-full text-left space-y-3 mt-4 text-sm text-ink/80">
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-teal/70 flex-shrink-0" />
                  <span className="truncate" title={user?.email}>
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-teal/70 flex-shrink-0" />
                  <span>{user?.phone || 'No. HP belum ditambahkan'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-teal/70 flex-shrink-0" />
                  <span>Terdaftar: {getJoinDate()}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Sidebar style on desktop) */}
            <div className="bg-white rounded-lg shadow-sm border border-parchment-dim p-2 mt-6 flex lg:flex-col gap-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'info'
                    ? 'bg-teal text-parchment shadow-sm'
                    : 'text-ink/70 hover:bg-parchment-dim hover:text-teal'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Ubah Informasi Profil</span>
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'password'
                    ? 'bg-teal text-parchment shadow-sm'
                    : 'text-ink/70 hover:bg-parchment-dim hover:text-teal'
                }`}
              >
                <LockClosedIcon className="w-4 h-4" />
                <span>Ubah Kata Sandi</span>
              </button>
            </div>
          </div>

          {/* Column 2 & 3: Content area */}
          <div className="lg:col-span-2">
            <div className="card bg-white p-6 sm:p-8 shadow-sm border border-parchment-dim min-h-[400px]">
              
              {/* Tab 1: Edit Profile Info */}
              {activeTab === 'info' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif font-bold text-teal mb-6 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-teal" />
                    Informasi Profil
                  </h3>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-ink/80 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
                          <UserIcon className="w-5 h-5" />
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className="input-field pl-10"
                          placeholder="Masukkan nama lengkap Anda"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-ink/80 mb-2">
                          Email (Tidak dapat diubah)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/30">
                            <EnvelopeIcon className="w-5 h-5" />
                          </span>
                          <input
                            type="email"
                            value={user?.email || ''}
                            className="input-field pl-10 bg-parchment-dim/40 cursor-not-allowed opacity-80"
                            disabled
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-ink/80 mb-2">
                          No. HP / WhatsApp
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
                            <PhoneIcon className="w-5 h-5" />
                          </span>
                          <input
                            type="text"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            className="input-field pl-10"
                            placeholder="Contoh: 08123456789"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink/80 mb-2">
                        Alamat Lengkap
                      </label>
                      <div className="relative">
                        <span className="absolute top-3 left-0 pl-3 flex items-start text-ink/40">
                          <MapPinIcon className="w-5 h-5" />
                        </span>
                        <textarea
                          name="address"
                          value={profileForm.address}
                          onChange={handleProfileChange}
                          rows={4}
                          className="input-field pl-10 pt-2"
                          placeholder="Masukkan alamat lengkap tempat tinggal Anda"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-parchment-dim flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="btn-accent"
                      >
                        {isUpdatingProfile ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                            <span>Menyimpan...</span>
                          </div>
                        ) : (
                          'Simpan Perubahan'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 2: Change Password */}
              {activeTab === 'password' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif font-bold text-teal mb-6 flex items-center gap-2">
                    <LockClosedIcon className="w-6 h-6 text-teal" />
                    Ganti Kata Sandi
                  </h3>
                  
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-ink/80 mb-2">
                        Kata Sandi Saat Ini
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
                          <LockClosedIcon className="w-5 h-5" />
                        </span>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="input-field pl-10"
                          placeholder="Masukkan kata sandi lama Anda"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-ink/80 mb-2">
                          Kata Sandi Baru
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
                            <LockClosedIcon className="w-5 h-5" />
                          </span>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="input-field pl-10"
                            placeholder="Minimal 6 karakter"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-ink/80 mb-2">
                          Konfirmasi Kata Sandi Baru
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
                            <LockClosedIcon className="w-5 h-5" />
                          </span>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="input-field pl-10"
                            placeholder="Ulangi kata sandi baru"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-parchment-dim flex justify-end">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="btn-accent"
                      >
                        {isChangingPassword ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                            <span>Mengubah...</span>
                          </div>
                        ) : (
                          'Ubah Sandi'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Weave Divider Bottom decoration */}
        <div className="weave-divider mt-12 rounded-full overflow-hidden" />

      </div>
    </div>
  );
};

export default ProfilePage;
