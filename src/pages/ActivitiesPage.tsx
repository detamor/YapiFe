import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ActivitiesPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const activities = [
    {
      id: 1,
      image: '/images/activities/yapi1.webp',
      title: 'Kegiatan Sosial',
      description: 'Program bantuan untuk anak-anak yang membutuhkan',
      date: '2024',
      category: 'Sosial',
    },
    {
      id: 2,
      image: '/images/activities/yapi 2.webp',
      title: 'Kunjungan Tamu',
      description: 'Menerima kunjungan dari donatur dan mitra',
      date: '2024',
      category: 'Kunjungan',
    },
    {
      id: 3,
      image: '/images/activities/yapi3.jpg',
      title: 'Program Pendidikan',
      description: 'Mendukung pendidikan anak-anak kurang mampu',
      date: '2024',
      category: 'Pendidikan',
    },
    {
      id: 4,
      image: '/images/activities/yapi4.jpg',
      title: 'Kegiatan Komunitas',
      description: 'Bersama membangun masa depan yang lebih baik',
      date: '2024',
      category: 'Komunitas',
    },
    {
      id: 5,
      image: '/images/activities/yapi 5.jpg',
      title: 'Program Kesehatan',
      description: 'Perawatan kesehatan anak-anak yatim piatu',
      date: '2024',
      category: 'Kesehatan',
    },
    {
      id: 6,
      image: '/images/activities/yapi 6.jpg',
      title: 'Kegiatan Belajar',
      description: 'Program pembelajaran dan bimbingan belajar',
      date: '2024',
      category: 'Pendidikan',
    },
    {
      id: 7,
      image: '/images/activities/yapi 7.jpg',
      title: 'Kegiatan Olahraga',
      description: 'Aktivitas fisik dan rekreasi untuk anak-anak',
      date: '2024',
      category: 'Olahraga',
    },
    {
      id: 8,
      image: '/images/activities/yapi 8.jpg',
      title: 'Kegiatan Seni',
      description: 'Program kreativitas dan seni untuk anak-anak',
      date: '2024',
      category: 'Seni',
    },
    {
      id: 9,
      image: '/images/activities/yapi liburan.jpg',
      title: 'Liburan Bersama',
      description: 'Kegiatan rekreasi dan liburan bersama',
      date: '2024',
      category: 'Rekreasi',
    },
    {
      id: 10,
      image: '/images/activities/kebahagian yapi.jpg',
      title: 'Kebahagiaan Bersama',
      description: 'Momen kebahagiaan anak-anak YAPI',
      date: '2024',
      category: 'Kebahagiaan',
    },
    {
      id: 11,
      image: '/images/activities/yapi 9.jpg',
      title: 'Program Pelatihan',
      description: 'Pelatihan keterampilan untuk anak-anak yatim piatu',
      date: '2024',
      category: 'Pelatihan',
    },
    {
      id: 12,
      image: '/images/activities/yapi 10.jpg',
      title: 'Kegiatan Keagamaan',
      description: 'Program spiritual dan keagamaan untuk anak-anak',
      date: '2024',
      category: 'Keagamaan',
    },
  ];

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Dokumentasi Kegiatan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lihat berbagai kegiatan dan kunjungan tamu yang telah kami lakukan
            dalam membantu anak-anak yang membutuhkan di Medan dan sekitarnya
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Beranda
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Dokumentasi Kegiatan
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="relative group cursor-pointer"
                onClick={() => openModal(activity.image)}
              >
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-12 h-12 text-white mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                    <p className="text-white text-sm text-center mt-2">
                      Klik untuk lihat lebih besar
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {activity.category}
                  </span>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ingin Berpartisipasi?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Bergabunglah dengan kami dalam membantu anak-anak yang
              membutuhkan. Setiap kontribusi Anda akan memberikan dampak positif
              bagi masa depan mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donations"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                Mulai Donasi
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
