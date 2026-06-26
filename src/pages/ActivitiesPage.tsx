import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface Activity {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: 'event' | 'program' | 'workshop' | 'competition';
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  schedule: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  };
  location: {
    name: string;
    address: string;
  };
  isPublic: boolean;
  isFeatured: boolean;
  media?: {
    images: Array<{
      url: string;
      caption: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

const ActivitiesPage: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  // Fetch activities from backend (approved & public activities)
  const { data, isLoading } = useQuery({
    queryKey: ['public-activities'],
    queryFn: async () => {
      const response = await api.get('/activities?limit=50');
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const mockActivities = [
    {
      id: 1,
      image: '/images/activities/yapi1.webp',
      title: 'Kegiatan Sosial',
      description: 'Program bantuan untuk anak-anak yang membutuhkan',
      date: '2024',
      category: 'Sosial',
      location: {
        name: 'Gedung YAPI Medan',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
    {
      id: 2,
      image: '/images/activities/yapi 2.webp',
      title: 'Kunjungan Tamu',
      description: 'Menerima kunjungan dari donatur dan mitra',
      date: '2024',
      category: 'Kunjungan',
      location: {
        name: 'Gedung YAPI Medan',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
    {
      id: 3,
      image: '/images/activities/yapi3.jpg',
      title: 'Program Pendidikan',
      description: 'Mendukung pendidikan anak-anak kurang mampu',
      date: '2024',
      category: 'Pendidikan',
      location: {
        name: 'Panti Asuhan YAPI Medan',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
    {
      id: 4,
      image: '/images/activities/yapi4.jpg',
      title: 'Kegiatan Komunitas',
      description: 'Bersama membangun masa depan yang lebih baik',
      date: '2024',
      category: 'Komunitas',
      location: {
        name: 'Gedung YAPI Medan',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
    {
      id: 5,
      image: '/images/activities/yapi 5.jpg',
      title: 'Program Kesehatan',
      description: 'Perawatan kesehatan anak-anak yatim piatu',
      date: '2024',
      category: 'Kesehatan',
      location: {
        name: 'Klinik Mitra YAPI',
        address: 'Medan, Sumatera Utara'
      }
    },
    {
      id: 6,
      image: '/images/activities/yapi 6.jpg',
      title: 'Kegiatan Belajar',
      description: 'Program pembelajaran dan bimbingan belajar',
      date: '2024',
      category: 'Pendidikan',
      location: {
        name: 'Ruang Belajar YAPI',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
    {
      id: 7,
      image: '/images/activities/yapi 7.jpg',
      title: 'Kegiatan Olahraga',
      description: 'Aktivitas fisik dan rekreasi untuk anak-anak',
      date: '2024',
      category: 'Olahraga',
      location: {
        name: 'Lapangan Olahraga YAPI',
        address: 'Medan, Sumatera Utara'
      }
    },
    {
      id: 8,
      image: '/images/activities/yapi 8.jpg',
      title: 'Kegiatan Seni',
      description: 'Program kreativitas dan seni untuk anak-anak',
      date: '2024',
      category: 'Seni',
      location: {
        name: 'Aula YAPI Medan',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
    {
      id: 9,
      image: '/images/activities/yapi liburan.jpg',
      title: 'Liburan Bersama',
      description: 'Kegiatan rekreasi dan liburan bersama',
      date: '2024',
      category: 'Rekreasi',
      location: {
        name: 'Taman Rekreasi Medan',
        address: 'Medan, Sumatera Utara'
      }
    },
    {
      id: 10,
      image: '/images/activities/kebahagian yapi.jpg',
      title: 'Kebahagiaan Bersama',
      description: 'Momen kebahagiaan anak-anak YAPI',
      date: '2024',
      category: 'Kebahagiaan',
      location: {
        name: 'Panti Asuhan YAPI Medan',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
    {
      id: 11,
      image: '/images/activities/yapi 9.jpg',
      title: 'Program Pelatihan',
      description: 'Pelatihan keterampilan untuk anak-anak yatim piatu',
      date: '2024',
      category: 'Pelatihan',
      location: {
        name: 'Pusat Pelatihan Keterampilan',
        address: 'Medan, Sumatera Utara'
      }
    },
    {
      id: 12,
      image: '/images/activities/yapi 10.jpg',
      title: 'Kegiatan Keagamaan',
      description: 'Program spiritual dan keagamaan untuk anak-anak',
      date: '2024',
      category: 'Keagamaan',
      location: {
        name: 'Musholla & Aula YAPI',
        address: 'Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan'
      }
    },
  ];

  const dbActivities = (data?.data?.activities || []).filter(
    (act: any) => act.status !== 'draft' && act.status !== 'cancelled'
  );
  // Use DB activities if available, fallback to mock activities so the page is never blank
  const displayActivities = dbActivities.length > 0 ? dbActivities : mockActivities;

  const openModal = (activity: any) => {
    setSelectedActivity(activity);
  };

  const closeModal = () => {
    setSelectedActivity(null);
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
            dalam membantu anak-anak yang membutuhkan di Medan dan sekitarnya.
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
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {displayActivities.map((activity: any) => {
              const mainImage = activity.media?.images?.[0]?.url || activity.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
              const displayImage = mainImage.startsWith('http') || mainImage.startsWith('/') || mainImage.startsWith('data:') ? mainImage : `/uploads/${mainImage}`;
              
              const dateText = activity.schedule?.startDate
                ? (() => {
                    try {
                      return new Date(activity.schedule.startDate).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    } catch (e) {
                      return activity.schedule.startDate;
                    }
                  })()
                : (activity.date || 'Baru');

              return (
                <div
                  key={activity._id || activity.id}
                  onClick={() => openModal(activity)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer group"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={displayImage}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <span className="bg-indigo-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                          {activity.category}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{dateText}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {activity.description}
                      </p>
                    </div>
                    {activity.location?.name && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 border-t border-gray-100 pt-3">
                        <span>📍</span>
                        <span className="truncate">{activity.location.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

      {/* Detail Explanation Modal */}
      {selectedActivity && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-80 bg-gray-100 flex-shrink-0">
              <img
                src={(() => {
                  const img = selectedActivity.media?.images?.[0]?.url || selectedActivity.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                  return img.startsWith('http') || img.startsWith('/') || img.startsWith('data:') ? img : `/uploads/${img}`;
                })()}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                }}
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md capitalize">
                  {selectedActivity.category}
                </span>
                {selectedActivity.type && (
                  <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md capitalize">
                    {selectedActivity.type}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-xs text-gray-500 font-sans font-medium uppercase tracking-wider">
                  Tanggal Pelaksanaan: {selectedActivity.schedule?.startDate ? (
                    (() => {
                      try {
                        const start = new Date(selectedActivity.schedule.startDate).toLocaleDateString('id-ID', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        });
                        const end = selectedActivity.schedule.endDate && selectedActivity.schedule.endDate !== selectedActivity.schedule.startDate
                          ? ' s/d ' + new Date(selectedActivity.schedule.endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                          : '';
                        return start + end;
                      } catch (e) {
                        return selectedActivity.schedule.startDate;
                      }
                    })()
                  ) : (selectedActivity.date || '-')}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedActivity.title}</h2>
              </div>

              {selectedActivity.location && (
                <div className="bg-gray-50 border border-gray-150 rounded-lg p-3 text-sm text-gray-700 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-gray-900">
                    <span>📍</span> Tempat Pelaksanaan: {selectedActivity.location.name}
                  </div>
                  {selectedActivity.location.address && (
                    <p className="text-xs text-gray-500 pl-5">{selectedActivity.location.address}</p>
                  )}
                </div>
              )}

              <div className="prose prose-indigo max-w-none text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-800 mb-2">Penjelasan Kegiatan:</h4>
                <p className="whitespace-pre-line">{selectedActivity.description}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end flex-shrink-0">
              <button
                onClick={closeModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                Tutup Dokumentasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
