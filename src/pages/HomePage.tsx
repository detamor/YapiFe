import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  AcademicCapIcon,
  UsersIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import TestimonialForm from '../components/testimonials/TestimonialForm';
import IframeMap from '../components/maps/IframeMap';

const activitiesPhotos = [
  { src: '/images/activities/yapi1.webp', title: 'Kegiatan Sosial', description: 'Program bantuan untuk anak-anak' },
  { src: '/images/activities/yapi 2.webp', title: 'Kunjungan Tamu', description: 'Menerima kunjungan dari donatur' },
  { src: '/images/activities/yapi3.jpg', title: 'Program Pendidikan', description: 'Mendukung pendidikan anak-anak' },
  { src: '/images/activities/yapi4.jpg', title: 'Kegiatan Komunitas', description: 'Bersama membangun masa depan' },
  { src: '/images/activities/yapi 5.jpg', title: 'Program Kesehatan', description: 'Perawatan kesehatan anak-anak' },
  { src: '/images/activities/yapi 6.jpg', title: 'Kegiatan Belajar', description: 'Program pembelajaran dan bimbingan' },
  { src: '/images/activities/yapi 7.jpg', title: 'Kegiatan Olahraga', description: 'Aktivitas fisik dan rekreasi' },
  { src: '/images/activities/yapi 8.jpg', title: 'Kegiatan Seni', description: 'Program kreativitas dan seni' },
  { src: '/images/activities/yapi liburan.jpg', title: 'Liburan Bersama', description: 'Kegiatan rekreasi dan liburan' },
  { src: '/images/activities/kebahagian yapi.jpg', title: 'Kebahagiaan Bersama', description: 'Momen kebahagiaan anak-anak' },
  { src: '/images/activities/yapi 9.jpg', title: 'Program Pelatihan', description: 'Pelatihan keterampilan untuk anak-anak' },
  { src: '/images/activities/yapi 10.jpg', title: 'Kegiatan Keagamaan', description: 'Program spiritual dan keagamaan' }
];

const HomePage: React.FC = () => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const showPrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prevIndex) => 
        prevIndex === 0 ? activitiesPhotos.length - 1 : prevIndex! - 1
      );
    }
  };

  const showNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prevIndex) => 
        prevIndex === activitiesPhotos.length - 1 ? 0 : prevIndex! + 1
      );
    }
  };


  const features = [
    {
      icon: HeartIcon,
      title: 'Bantuan Dana',
      description:
        'Memberikan bantuan finansial untuk memenuhi kebutuhan dasar anak-anak yatim piatu.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Program Pendidikan',
      description:
        'Membantu anak-anak yatim piatu mendapatkan pendidikan yang layak dan berkualitas.',
    },
    {
      icon: UsersIcon,
      title: 'Tempat Tinggal',
      description:
        'Menyediakan tempat tinggal yang aman dan nyaman bagi anak-anak yang membutuhkan.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Transparansi',
      description:
        'Setiap donasi yang Anda berikan akan kami laporkan dengan detail dan transparan.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: 'url(/images/ankyapi.png)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Yayasan Advent Peduli Indonesia
              <span className="block text-yellow-300">Cabang Medan</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
              YAPI Medan adalah singkatan dari Yayasan Advent Peduli Indonesia
              cabang Medan. Yayasan ini merupakan lembaga sosial yang bergerak
              di bidang kemanusiaan, khususnya dalam menangani anak-anak yatim
              dan piatu. YAPI Medan juga merupakan bagian dari Yayasan Advent
              Peduli Indonesia yang memiliki beberapa cabang di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donations"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Mulai Donasi
              </Link>
              <Link
                to="/children"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors duration-200"
              >
                Lihat Anak-anak
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Anak Terbantu</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600">Donatur Aktif</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                50+
              </div>
              <div className="text-gray-600">Kegiatan Sosial</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                5
              </div>
              <div className="text-gray-600">Tahun Berdiri</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Program Bantuan YAPI Medan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sebagai cabang Yayasan Advent Peduli Indonesia, YAPI Medan
              menyelenggarakan berbagai program untuk anak-anak yatim dan piatu
              di Medan dan sekitarnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bergabunglah dengan YAPI Medan
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Setiap donasi Anda akan membantu YAPI Medan dalam menangani
            anak-anak yatim dan piatu di Medan. Mari kita bersama-sama
            memberikan mereka kehidupan yang layak dan masa depan yang lebih
            cerah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donations"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Donasi Sekarang
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors duration-200"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dokumentasi Program YAPI Medan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat berbagai program bantuan dan kegiatan sosial yang telah YAPI
              Medan lakukan untuk anak-anak yatim dan piatu di Medan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {activitiesPhotos.map((photo, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover-scale"
                onClick={() => setActivePhotoIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePhotoIndex(index);
                  }
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{photo.title}</h3>
                    <p className="text-sm text-gray-200">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/activities"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              Lihat Semua Foto Kegiatan
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Lightbox Modal */}
        {activePhotoIndex !== null && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(null); }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 focus:outline-none transition-colors"
              aria-label="Tutup galeri"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev Button */}
            <button 
              onClick={showPrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full focus:outline-none transition-all duration-200 hover:scale-105"
              aria-label="Foto sebelumnya"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image Container */}
            <div 
              className="relative max-w-4xl max-h-[75vh] flex items-center justify-center animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activitiesPhotos[activePhotoIndex].src} 
                alt={activitiesPhotos[activePhotoIndex].title} 
                className="max-w-full max-h-[75vh] object-contain rounded-md shadow-2xl"
              />
            </div>

            {/* Text / Captions */}
            <div 
              className="mt-6 text-center text-white max-w-2xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold">{activitiesPhotos[activePhotoIndex].title}</h3>
              <p className="text-gray-300 mt-2 text-sm">{activitiesPhotos[activePhotoIndex].description}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-white/10 text-xs rounded-full">
                {activePhotoIndex + 1} / {activitiesPhotos.length}
              </span>
            </div>

            {/* Next Button */}
            <button 
              onClick={showNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full focus:outline-none transition-all duration-200 hover:scale-105"
              aria-label="Foto berikutnya"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </section>


      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Testimoni Program YAPI Medan
            </h2>
            <p className="text-xl text-gray-600">
              Testimoni dari donatur dan anak-anak yang telah menerima manfaat
              program YAPI Medan
            </p>
            <div className="mt-6">
              <Link
                to="/testimonials"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
              >
                Lihat Semua Testimoni
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Ahmad Rizki</div>
                  <div className="text-sm text-gray-600">Donatur</div>
                </div>
              </div>
              <p className="text-gray-700">
                "Sangat senang bisa membantu anak-anak yatim piatu melalui YAPI
                Medan. Program bantuan dan pendidikannya sangat terstruktur."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">
                    Siti Nurhaliza
                  </div>
                  <div className="text-sm text-gray-600">Penerima Manfaat</div>
                </div>
              </div>
              <p className="text-gray-700">
                "Berkat bantuan dari YAPI Medan, saya bisa melanjutkan sekolah
                dan mendapatkan tempat tinggal yang layak."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Maya Sari</div>
                  <div className="text-sm text-gray-600">Volunteer</div>
                </div>
              </div>
              <p className="text-gray-700">
                "Menjadi volunteer di YAPI Medan memberikan pengalaman yang
                sangat berharga. Melihat anak-anak yatim piatu tersenyum adalah
                kebahagiaan tersendiri."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bagikan Pengalaman Anda
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Apakah Anda pernah berinteraksi dengan YAPI Medan? Bagikan
              pengalaman dan testimoni Anda untuk membantu orang lain memahami
              dampak program YAPI Medan.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <TestimonialForm />
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lokasi YAPI Medan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kunjungi kantor YAPI Medan untuk melihat langsung kegiatan kami
              atau hubungi kami untuk informasi lebih lanjut
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div>
              <IframeMap
                latitude={3.5590454}
                longitude={98.7044167}
                zoom={16}
                height="400px"
                className="w-full"
                title="Lokasi YAPI Medan"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Informasi Kontak
                </h3>
                <p className="text-gray-600 mb-6">
                  YAPI Medan siap melayani Anda dengan berbagai program bantuan
                  untuk anak-anak yatim dan piatu di Medan.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Alamat</h4>
                    <p className="text-gray-600">
                      Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan
                      Kota, Kota Medan, Sumatera Utara 20216
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Telepon</h4>
                    <p className="text-gray-600">0813-7058-0833</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Jam Operasional
                    </h4>
                    <p className="text-gray-600">
                      Senin - Jumat: 08:00 - 17:00
                      <br />
                      Sabtu: 08:00 - 12:00
                      <br />
                      Minggu: Tutup
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://maps.google.com/maps?q=3.5590454,98.7044167"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
