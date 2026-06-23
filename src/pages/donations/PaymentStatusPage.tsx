import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Sedang memeriksa status pembayaran...');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await api.get(`/payments/midtrans/status/${orderId}`);
        const currentDonation = response.data?.data?.donation;

        if (currentDonation) {
          setDonation(currentDonation);
          
          // Jika status sudah final (completed / failed) atau kita sudah mencoba 5 kali, hentikan loading
          if (currentDonation.status !== 'pending' || attempts >= 5) {
            setLoading(false);
          } else {
            // Jika masih pending, jadwalkan pemeriksaan ulang dalam 3 detik
            setAttempts(prev => prev + 1);
            setStatusMessage(`Menunggu verifikasi pembayaran... (Percobaan ${attempts + 1}/5)`);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching donation status:', error);
        // Teruskan pencarian jika error, mungkin server sedang sibuk
        if (attempts >= 5) {
          setLoading(false);
        } else {
          setAttempts(prev => prev + 1);
        }
      }
    };

    const timer = setTimeout(() => {
      if (loading && orderId) {
        checkStatus();
      }
    }, attempts === 0 ? 0 : 3000); // Percobaan pertama langsung, selanjutnya tiap 3 detik

    return () => clearTimeout(timer);
  }, [orderId, attempts, loading]);

  const handlePrint = () => {
    window.print();
  };

  if (!orderId) {
    return (
      <div className="bg-parchment min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-parchment-dim shadow-sm">
          <XCircleIcon className="mx-auto h-12 w-12 text-coral mb-4" />
          <h2 className="text-2xl font-bold font-serif text-teal mb-2">Order ID Tidak Valid</h2>
          <p className="text-ink-soft mb-6 text-sm">
            Halaman ini membutuhkan ID Transaksi yang valid untuk menampilkan status pembayaran.
          </p>
          <Link to="/" className="btn-primary text-sm px-6 py-2">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-parchment min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {loading ? (
          /* Processing / Loading State */
          <div className="bg-white rounded-lg border border-parchment-dim p-12 text-center shadow-sm">
            <ArrowPathIcon className="mx-auto h-12 w-12 text-teal animate-spin mb-4" />
            <h2 className="text-2xl font-bold font-serif text-teal mb-2">Verifikasi Transaksi</h2>
            <p className="text-ink-soft text-sm mb-1">{statusMessage}</p>
            <p className="text-xs text-ink-soft/70">
              Jangan menutup atau merefresh halaman ini sampai verifikasi selesai.
            </p>
          </div>
        ) : !donation ? (
          /* Error: Donation record not found */
          <div className="bg-white rounded-lg border border-parchment-dim p-12 text-center shadow-sm">
            <XCircleIcon className="mx-auto h-12 w-12 text-coral mb-4" />
            <h2 className="text-2xl font-bold font-serif text-teal mb-2">Data Donasi Tidak Ditemukan</h2>
            <p className="text-ink-soft text-sm mb-6">
              Mohon maaf, transaksi dengan nomor order <span className="font-mono text-teal font-semibold">{orderId}</span> tidak tercatat di server kami.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/donations" className="btn-primary text-sm px-6 py-2">
                Ulangi Donasi
              </Link>
              <Link to="/" className="btn-secondary text-sm px-6 py-2">
                Beranda
              </Link>
            </div>
          </div>
        ) : (
          /* Payment Status Content */
          <div className="space-y-6">
            
            {/* Status Header Box */}
            <div className="bg-white rounded-lg border border-parchment-dim p-8 text-center shadow-sm print:shadow-none">
              {donation.status === 'completed' && (
                <>
                  <CheckCircleIcon className="mx-auto h-16 w-16 text-sage mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal mb-1">
                    Donasi Berhasil Diterima
                  </h2>
                  <p className="text-sm text-ink-soft max-w-md mx-auto mt-2 leading-relaxed">
                    Terima kasih atas kedermawanan Anda. Dukungan Anda membantu merajut benang masa depan panti asuhan kami.
                  </p>
                </>
              )}

              {donation.status === 'pending' && (
                <>
                  <ClockIcon className="mx-auto h-16 w-16 text-amber mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal mb-1">
                    Menunggu Pembayaran
                  </h2>
                  <p className="text-sm text-ink-soft max-w-md mx-auto mt-2 leading-relaxed">
                    Silakan selesaikan pembayaran Anda sesuai instruksi di aplikasi e-wallet atau bank transfer Anda. Status donasi akan diperbarui secara otomatis.
                  </p>
                </>
              )}

              {['failed', 'cancelled'].includes(donation.status) && (
                <>
                  <XCircleIcon className="mx-auto h-16 w-16 text-coral mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal mb-1">
                    Pembayaran Gagal / Dibatalkan
                  </h2>
                  <p className="text-sm text-ink-soft max-w-md mx-auto mt-2 leading-relaxed">
                    Mohon maaf, transaksi pembayaran Anda tidak berhasil. Silakan ulangi transaksi atau pilih metode pembayaran lain.
                  </p>
                </>
              )}
            </div>

            {/* Official Receipt Box */}
            {donation.status === 'completed' && (
              <div id="receipt" className="bg-white rounded-lg border border-parchment-dim p-8 shadow-sm relative overflow-hidden print:border-none print:shadow-none">
                
                {/* Batak Weave Divider decoration on top */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-amber repeating-linear-gradient(45deg, rgba(27, 59, 54, 0.2) 0px, rgba(27, 59, 54, 0.2) 2.5px, transparent 2.5px, transparent 10px)"></div>
                
                {/* Brand Header */}
                <div className="text-center border-b border-parchment-dim pb-6 mb-6">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-ink-soft">
                    Kuitansi Donasi Resmi
                  </span>
                  <h3 className="text-xl font-bold font-serif text-teal mt-1">
                    Yayasan Advent Peduli Indonesia (YAPI)
                  </h3>
                  <p className="text-xs text-ink-soft">Cabang Medan, Sumatera Utara</p>
                </div>

                {/* Receipt Details Grid */}
                <div className="space-y-4 text-sm font-sans">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Nomor Kuitansi</span>
                    <span className="font-mono text-teal font-bold">{donation.receiptNumber || orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Waktu Pembayaran</span>
                    <span className="font-mono">
                      {new Date(donation.verifiedAt || donation.updatedAt).toLocaleString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Metode Pembayaran</span>
                    <span className="capitalize">{donation.paymentMethod?.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-parchment-dim my-3"></div>

                  <div className="flex justify-between">
                    <span className="text-ink-soft">Nama Donatur</span>
                    <span className="font-semibold">
                      {donation.donaturInfo?.isAnonymous ? 'Donatur Anonim' : donation.donaturInfo?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Email Donatur</span>
                    <span>{donation.donaturInfo?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Kategori Program</span>
                    <span className="capitalize">{donation.category === 'sponsorship' ? 'Sponsorship Anak Asuh' : donation.category}</span>
                  </div>
                  {donation.child && (
                    <div className="flex justify-between">
                      <span className="text-ink-soft">Penerima Manfaat</span>
                      <span className="font-semibold text-teal font-serif">
                        {donation.child?.name || 'Adik Asuh'}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-parchment-dim my-3"></div>

                  <div className="flex justify-between items-center py-2 bg-parchment-dim px-4 rounded-md">
                    <span className="text-teal font-bold text-base">Jumlah Donasi</span>
                    <span className="font-mono font-bold text-teal text-xl">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                      }).format(donation.amount)}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-8 text-[11px] text-ink-soft/70">
                  <p>Kuitansi ini diterbitkan secara sah dan otomatis oleh sistem YAPI Medan.</p>
                  <p className="mt-1">NPW: 01.345.678.9-123.000 / Lembar Bukti Transaksi Elektronik</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
              {donation.status === 'completed' && (
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 px-6 border border-teal text-teal font-semibold rounded-md hover:bg-teal/5 transition-all duration-300 text-center"
                >
                  Cetak Bukti Transfer
                </button>
              )}
              
              {isAuthenticated ? (
                <Link
                  to="/donatur"
                  className="flex-1 py-3 px-6 bg-teal hover:bg-teal-light text-parchment font-semibold rounded-md transition-all duration-300 text-center"
                >
                  Lihat Riwayat Saya
                </Link>
              ) : (
                <Link
                  to="/"
                  className="flex-1 py-3 px-6 bg-teal hover:bg-teal-light text-parchment font-semibold rounded-md transition-all duration-300 text-center"
                >
                  Kembali ke Beranda
                </Link>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentStatusPage;
