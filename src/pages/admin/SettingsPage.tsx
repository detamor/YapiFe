import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'general' | 'contact' | 'security'>('general');

  // General Settings Form
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'YAPI Medan',
    shortName: 'Yayasan Advent Peduli Indonesia',
    description: 'YAPI Medan adalah singkatan dari Yayasan Advent Peduli Indonesia cabang Medan. Yayasan ini merupakan lembaga sosial yang bergerak di bidang kemanusiaan, khususnya dalam menangani anak-anak yatim dan piatu.',
    maintenanceMode: false,
    publicRegistrations: true,
  });

  // Contact Settings Form
  const [contactSettings, setContactSettings] = useState({
    address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan, Sumatera Utara 20216',
    phone: '0813-7058-0833',
    email: 'info@yapimedan.org',
    mapLink: 'https://maps.google.com/maps?q=3.5590454,98.7044167',
  });

  // Security Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pengaturan umum berhasil disimpan!');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Informasi kontak berhasil diperbarui!');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Konfirmasi password baru tidak cocok!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter!');
      return;
    }
    toast.success('Password admin berhasil diubah!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const sections = [
    { id: 'general', name: 'Umum & Instansi', icon: '⚙️' },
    { id: 'contact', name: 'Kontak & Lokasi', icon: '📞' },
    { id: 'security', name: 'Keamanan & Sandi', icon: '🔒' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
          <p className="mt-2 text-gray-600">
            Kelola konfigurasi instansi, media sosial, kontak yayasan, serta pengaturan keamanan akun administrator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit lg:col-span-1">
            <nav className="space-y-1">
              {sections.map((sec) => {
                const active = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold flex items-center gap-3 transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{sec.icon}</span>
                    {sec.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'general' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Pengaturan Umum & Instansi</h3>
                <form onSubmit={handleSaveGeneral} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Website</label>
                      <input
                        type="text"
                        value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panjang Yayasan</label>
                      <input
                        type="text"
                        value={generalSettings.shortName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, shortName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat Yayasan (Tentang Kami)</label>
                    <textarea
                      value={generalSettings.description}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      required
                    ></textarea>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">Mode Perawatan (Maintenance Mode)</span>
                        <span className="text-xs text-gray-500">Tutup akses publik dan hanya izinkan admin yang masuk.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.maintenanceMode}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">Pendaftaran Akun Terbuka</span>
                        <span className="text-xs text-gray-500">Izinkan publik untuk mendaftar akun donatur/volunteer secara mandiri.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.publicRegistrations}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, publicRegistrations: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors text-sm shadow-sm"
                    >
                      Simpan Pengaturan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Informasi Kontak & Lokasi</h3>
                <form onSubmit={handleSaveContact} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Yayasan</label>
                    <textarea
                      value={contactSettings.address}
                      onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No. Telp / WhatsApp</label>
                      <input
                        type="text"
                        value={contactSettings.phone}
                        onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Resmi</label>
                      <input
                        type="email"
                        value={contactSettings.email}
                        onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps (Rute)</label>
                    <input
                      type="text"
                      value={contactSettings.mapLink}
                      onChange={(e) => setContactSettings({ ...contactSettings, mapLink: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      required
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors text-sm shadow-sm"
                    >
                      Perbarui Kontak
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Keamanan & Perubahan Sandi</h3>
                <form onSubmit={handleSavePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors text-sm shadow-sm"
                    >
                      Ubah Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
