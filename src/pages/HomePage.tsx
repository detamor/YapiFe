import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import TestimonialForm from '../components/testimonials/TestimonialForm';
import IframeMap from '../components/maps/IframeMap';
import { childrenService } from '../services/children';
import { reportsService, PublicStats } from '../services/reports';
import api from '../services/api';
import { Child } from '../types';
import { calculateAge } from '../utils/dateUtils';

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
  const [featuredChildren, setFeaturedChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [stats, setStats] = useState<PublicStats>({
    totalChildren: 0,
    totalDonors: 0,
    totalActivities: 0,
    yearsOfService: new Date().getFullYear() - 2005,
  });
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>(activitiesPhotos);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await reportsService.getPublicStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch public stats:', err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/activities', {
          params: { limit: 20, sort: '-createdAt' }
        });
        
        let activitiesList = [];
        if (res.data?.data && Array.isArray(res.data.data)) {
          activitiesList = res.data.data;
        } else if (res.data?.data && typeof res.data.data === 'object') {
          activitiesList = res.data.data.activities || res.data.data.items || [];
        } else if (res.data?.items && Array.isArray(res.data.items)) {
          activitiesList = res.data.items;
        } else if (Array.isArray(res.data)) {
          activitiesList = res.data;
        }
        
        const dynamicPhotos: any[] = [];
        activitiesList.forEach((act: any) => {
          if (act.media?.images && act.media.images.length > 0) {
            act.media.images.forEach((img: any) => {
              if (img.url) {
                dynamicPhotos.push({
                  src: img.url,
                  title: act.title,
                  description: img.caption || act.description,
                });
              }
            });
          }
        });

        if (dynamicPhotos.length > 0) {
          const merged = [...dynamicPhotos];
          if (merged.length < 8) {
            activitiesPhotos.forEach(p => {
              if (merged.length < 8 && !merged.some(m => m.src === p.src)) {
                merged.push(p);
              }
            });
          }
          setGalleryPhotos(merged.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to fetch gallery documentation:', err);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Ambil data anak, filter secara manual untuk mendapatkan yang unggulan/butuh sponsor
        const res = await childrenService.getAll({ page: 1, limit: 10 });
        
        let childrenArray = [];
        if (res?.data && Array.isArray(res.data)) {
          childrenArray = res.data;
        } else if (res?.data && typeof res.data === 'object') {
          childrenArray = (res.data as any).children || (res.data as any).items || [];
        } else if (Array.isArray(res)) {
          childrenArray = res;
        }
        
        // Ambil maksimal 3 anak
        const filtered = childrenArray
          .filter((c: any) => c.isPublic && c.isActive)
          .slice(0, 3)
          .map((child: any) => ({
            id: child._id || child.id,
            name: child.name,
            dateOfBirth: child.dateOfBirth,
            gender: (child.gender === 'laki-laki' ? 'male' : 'female') as 'male' | 'female',
            images: child.images?.map((img: any) => img.url || img) || [],
            story: child.background?.story || `${child.name} membutuhkan sponsor hangat Anda.`,
            currentStatus: {
              living: child.currentStatus?.livingStatus === 'di-yayasan' ? 'Di Yayasan' : 'Keluarga Asuh',
              health: child.currentStatus?.healthStatus === 'sehat' ? 'Sehat' : 'Perhatian Khusus',
              education: child.currentStatus?.educationLevel?.toUpperCase() || 'SD',
            },
            skills: child.skills?.map((s: any) => s.name) || [],
            isActive: child.isActive,
            isPublic: child.isPublic,
            isFeatured: child.sponsorship?.isSponsored || false, // Menggunakan status sponsor
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
          }));

        setFeaturedChildren(filtered);
      } catch (err) {
        console.error('Failed to fetch featured children:', err);
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchFeatured();
  }, []);

  const showPrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prevIndex) => 
        prevIndex === 0 ? galleryPhotos.length - 1 : prevIndex! - 1
      );
    }
  };

  const showNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prevIndex) => 
        prevIndex === galleryPhotos.length - 1 ? 0 : prevIndex! + 1
      );
    }
  };

  const features = [
    {
      icon: HeartIcon,
      title: 'Bantuan Dana / Sponsor',
      description:
        'Dukungan finansial rutin bulanan atau sekali bayar untuk menjamin biaya hidup anak asuh.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Program Pendidikan',
      description:
        'Memastikan anak asuh menempuh jalur sekolah formal, bimbingan belajar, dan pelatihan skill.',
    },
    {
      icon: HomeIcon,
      title: 'Tempat Tinggal Layak',
      description:
        'Menyediakan wisma asrama asri di panti asuhan Medan Kota dengan pengasuhan penuh kasih sayang.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Transparansi & Laporan',
      description:
        'Laporan penggunaan donasi disajikan secara audit transparan dan langsung di dashboard donatur.',
    },
  ];

  return (
    <div className="bg-parchment text-ink min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white h-[650px] flex items-center"
        style={{ backgroundImage: 'url(/images/ankyapi.png)' }}
      >
        <div className="absolute inset-0 bg-teal/70 mix-blend-multiply"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
          <div className="text-left max-w-3xl">
            <span className="text-amber uppercase tracking-wider font-semibold text-sm font-sans mb-3 block">
              Yayasan Advent Peduli Indonesia
            </span>
            <h1 className="text-2xl md:text-4xl font-sans font-semibold mb-4 text-parchment leading-relaxed">
              "Perhatikanlah orang yang tulus dan lihatlah kepada orang yang jujur, sebab pada orang yang suka damai akan ada masa depan."
            </h1>
            <p className="text-amber text-lg md:text-xl font-semibold mb-6 font-sans">
              — Mazmur 37:37
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-2xl text-parchment/90 leading-relaxed font-sans">
              YAPI Medan berdedikasi mengasuh dan memberikan akses pendidikan, kesehatan, serta lingkungan kekeluargaan yang layak bagi anak-anak yatim, piatu, dan kurang mampu di Sumatera Utara.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/donations"
                className="bg-amber text-ink px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-dark transition-all duration-300 shadow-md text-center hover-scale"
              >
                Mulai Donasi
              </Link>
              <Link
                to="/children"
                className="border-2 border-parchment text-parchment px-8 py-4 rounded-lg font-semibold text-lg hover:bg-parchment hover:text-teal transition-all duration-300 text-center hover-scale"
              >
                Lihat Anak-Asuh
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* Stats Section */}
      <section className="py-16 bg-parchment-dim border-b border-parchment-dim/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4 bg-white/40 rounded-lg border border-white/50 backdrop-blur-sm shadow-sm">
              <div className="text-3xl md:text-5xl font-bold font-mono text-teal mb-2">
                {stats.totalChildren}
              </div>
              <div className="text-ink-soft text-sm font-semibold tracking-wide">Anak Terbantu</div>
            </div>
            <div className="p-4 bg-white/40 rounded-lg border border-white/50 backdrop-blur-sm shadow-sm">
              <div className="text-3xl md:text-5xl font-bold font-mono text-teal mb-2">
                {stats.totalDonors}
              </div>
              <div className="text-ink-soft text-sm font-semibold tracking-wide">Donatur Aktif</div>
            </div>
            <div className="p-4 bg-white/40 rounded-lg border border-white/50 backdrop-blur-sm shadow-sm">
              <div className="text-3xl md:text-5xl font-bold font-mono text-teal mb-2">
                {stats.totalActivities}
              </div>
              <div className="text-ink-soft text-sm font-semibold tracking-wide">Kegiatan Sosial</div>
            </div>
            <div className="p-4 bg-white/40 rounded-lg border border-white/50 backdrop-blur-sm shadow-sm">
              <div className="text-3xl md:text-5xl font-bold font-mono text-teal mb-2">
                {stats.yearsOfService}
              </div>
              <div className="text-ink-soft text-sm font-semibold tracking-wide">Tahun Pengabdian</div>
            </div>
          </div>
        </div>
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* Featured Children Section */}
      <section className="py-20 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal font-semibold text-xs tracking-wider uppercase font-sans">
              Program Sponsorship Anak Asuh
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal mt-2">
              Benang Harapan YAPI
            </h2>
            <p className="text-lg text-ink-soft max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Ulurkan kasih Anda untuk menjadi sponsor tetap mereka. Bantu memotong tali kemiskinan dengan beasiswa hidup dan pendidikan bulanan.
            </p>
          </div>

          {loadingChildren ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredChildren.map((child) => {
                const age = calculateAge(child.dateOfBirth);
                const mainImage = child.images?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                
                return (
                  <div key={child.id} className="card bg-white border border-parchment-dim hover-scale flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={!mainImage ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' : (mainImage.startsWith('http') || mainImage.startsWith('/') ? mainImage : `/uploads/${mainImage}`)}
                        alt={child.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white ${
                          child.gender === 'male' ? 'bg-teal-light' : 'bg-coral'
                        }`}>
                          {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-baseline mb-3">
                        <h3 className="text-xl font-bold text-teal font-serif">{child.name}</h3>
                        <span className="text-sm font-mono text-ink-soft bg-parchment px-2 py-0.5 rounded">
                          {age} th
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="px-2 py-0.5 bg-teal/10 text-teal text-xs font-medium rounded">
                          {child.currentStatus.living}
                        </span>
                        <span className="px-2 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded">
                          {child.currentStatus.health}
                        </span>
                        <span className="px-2 py-0.5 bg-amber/10 text-amber text-xs font-medium rounded">
                          Sekolah: {child.currentStatus.education}
                        </span>
                      </div>

                      <p className="text-sm text-ink-soft font-sans line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {child.story}
                      </p>

                      {/* Sponsorship Weave Progress Bar */}
                      <div className="mb-6 pt-4 border-t border-parchment-dim">
                        <div className="flex justify-between text-xs font-semibold text-ink-soft mb-1.5">
                          <span>Status Sponsorship</span>
                          <span className="font-mono text-teal">
                            {child.isFeatured ? '100% (Disponsori)' : 'Butuh Sponsor'}
                          </span>
                        </div>
                        <div className="weave-bar">
                          <div
                            className="weave-bar-fill"
                            style={{ width: child.isFeatured ? '100%' : '15%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-ink-soft/70 mt-1.5 leading-relaxed italic">
                          {child.isFeatured 
                            ? 'Mendapatkan bantuan pendidikan bulanan secara penuh.'
                            : 'Membutuhkan bantuan sponsor bulanan untuk menunjang sekolah.'}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          to={`/children/${child.id}`}
                          className="flex-1 text-center py-2 px-3 border border-teal text-teal text-sm font-semibold rounded-md hover:bg-teal/5 transition-colors"
                        >
                          Detail Kisah
                        </Link>
                        <Link
                          to={`/donations?childId=${child.id}&childName=${encodeURIComponent(child.name)}&category=sponsorship`}
                          className="flex-1 text-center py-2 px-3 bg-amber hover:bg-amber-dark text-ink text-sm font-semibold rounded-md transition-colors"
                        >
                          Sponsori
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/children"
              className="inline-flex items-center text-teal font-semibold hover:text-teal-light transition-colors group"
            >
              Lihat Seluruh Anak Asuh
              <svg
                className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* Features Section */}
      <section className="py-20 bg-parchment-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal font-semibold text-xs tracking-wider uppercase">Fokus Pengabdian</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal mt-2">
              Program Pengasuhan & Bantuan
            </h2>
            <p className="text-lg text-ink-soft max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Bersama donatur, kami membangun pilar kesejahteraan holistik agar masa kecil mereka tetap dihiasi kebahagiaan dan mimpi cerah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-8 border border-parchment-dim hover-scale shadow-sm">
                <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-xl font-bold text-teal mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed font-sans">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* CTA Section */}
      <section className="py-20 bg-teal text-parchment relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-overlay" style={{ backgroundImage: 'url(/images/ankyapi.png)' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-parchment mb-6 leading-tight">
            Bagikan Berkat, Bantu Anak-anak Panti Asuhan
          </h2>
          <p className="text-lg md:text-xl text-parchment/80 mb-8 max-w-2xl mx-auto leading-relaxed font-sans">
            Setiap nominal donasi Anda, sekecil apapun, disalurkan langsung untuk pangan sehat, perlengkapan sekolah, dan beasiswa mereka. Mari menenun jembatan masa depan bagi mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donations"
              className="bg-amber text-ink px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-dark transition-all duration-300 shadow-md hover-scale"
            >
              Donasi Otomatis (QRIS/VA)
            </Link>
            <Link
              to="/contact"
              className="border-2 border-parchment text-parchment px-8 py-4 rounded-lg font-semibold text-lg hover:bg-parchment hover:text-teal transition-all duration-300 hover-scale"
            >
              Kunjungi Panti Asuhan
            </Link>
          </div>
        </div>
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* Activities Gallery Section */}
      <section className="py-20 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal font-semibold text-xs tracking-wider uppercase">Galeri Dokumentasi</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal mt-2">
              Kegiatan Sosial Terkini
            </h2>
            <p className="text-lg text-ink-soft max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Momen senyuman, kebersamaan, belajar, dan liburan yang kami lalui bersama donatur dan para relawan panti asuhan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryPhotos.slice(0, 8).map((photo, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg shadow-sm border border-parchment-dim cursor-pointer hover-scale"
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
                <div className="absolute inset-0 bg-gradient-to-t from-teal/90 via-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-parchment">
                    <h3 className="font-serif font-bold text-lg leading-tight">{photo.title}</h3>
                    <p className="text-xs text-parchment/80 mt-1 font-sans">
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
              className="inline-flex items-center px-6 py-3 bg-teal hover:bg-teal-light text-parchment font-semibold rounded-md shadow-sm transition-colors hover-scale"
            >
              Lihat Dokumentasi Lengkap
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Lightbox Modal */}
        {activePhotoIndex !== null && (
          <div 
            className="fixed inset-0 bg-teal/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
            onClick={() => setActivePhotoIndex(null)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(null); }}
              className="absolute top-4 right-4 text-parchment hover:text-amber p-2 focus:outline-none transition-colors"
              aria-label="Tutup galeri"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button 
              onClick={showPrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-parchment p-3 rounded-full focus:outline-none transition-all duration-200 hover:scale-105"
              aria-label="Foto sebelumnya"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div 
              className="relative max-w-4xl max-h-[70vh] flex items-center justify-center animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={galleryPhotos[activePhotoIndex].src} 
                alt={galleryPhotos[activePhotoIndex].title} 
                className="max-w-full max-h-[70vh] object-contain rounded-md shadow-2xl border border-white/10"
              />
            </div>

            <div 
              className="mt-6 text-center text-parchment max-w-2xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-serif font-bold text-amber">{galleryPhotos[activePhotoIndex].title}</h3>
              <p className="text-parchment/80 mt-2 text-sm font-sans">{galleryPhotos[activePhotoIndex].description}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-white/10 text-xs rounded-full font-mono text-parchment/70">
                {activePhotoIndex + 1} / {galleryPhotos.length}
              </span>
            </div>

            <button 
              onClick={showNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-parchment p-3 rounded-full focus:outline-none transition-all duration-200 hover:scale-105"
              aria-label="Foto berikutnya"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* Testimonial Section */}
      <section className="py-20 bg-parchment-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal font-semibold text-xs tracking-wider uppercase">Dampak Nyata</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal mt-2">
              Kisah Kasih & Testimoni
            </h2>
            <p className="text-lg text-ink-soft max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Dengar kesan tulus dari mereka yang tergabung dalam rajutan kebaikan YAPI Medan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-parchment-dim shadow-sm flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center text-teal font-serif font-bold">
                  AR
                </div>
                <div className="ml-3">
                  <div className="font-bold text-teal">Ahmad Rizki</div>
                  <div className="text-xs text-ink-soft">Donatur Rutin</div>
                </div>
              </div>
              <p className="text-ink-soft text-sm italic font-sans leading-relaxed flex-grow">
                "Dukungan bulanan YAPI sangat membantu menyalurkan donasi. Saya bisa melihat profil prestasi sekolah adik asuh langsung di dasbor donatur."
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-parchment-dim shadow-sm flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center text-teal font-serif font-bold">
                  SN
                </div>
                <div className="ml-3">
                  <div className="font-bold text-teal">Siti Nurhaliza</div>
                  <div className="text-xs text-ink-soft">Alumni Penerima Manfaat</div>
                </div>
              </div>
              <p className="text-ink-soft text-sm italic font-sans leading-relaxed flex-grow">
                "Panti asuhan YAPI Medan adalah rumah tempat saya belajar dan berkembang. Berkat beasiswa donatur, saya kini bisa berkuliah semester 4."
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-parchment-dim shadow-sm flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center text-teal font-serif font-bold">
                  MS
                </div>
                <div className="ml-3">
                  <div className="font-bold text-teal">Maya Sari</div>
                  <div className="text-xs text-ink-soft">Volunteer & Pengajar</div>
                </div>
              </div>
              <p className="text-ink-soft text-sm italic font-sans leading-relaxed flex-grow">
                "Mengisi bimbingan belajar komputer untuk anak-anak panti asuhan sungguh berkesan. Mereka sangat antusias belajar dan memiliki rasa penasaran tinggi."
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/testimonials"
              className="inline-flex items-center text-teal font-semibold hover:text-teal-light transition-colors group"
            >
              Lihat Pengalaman Lainnya
              <svg
                className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* Testimonial Form Section */}
      <section className="py-20 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal font-semibold text-xs tracking-wider uppercase">Suara Anda</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal mt-2">
              Kirimkan Testimoni Anda
            </h2>
            <p className="text-lg text-ink-soft max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Tuliskan kisah pengalaman kunjungan atau dukungan Anda kepada YAPI Medan untuk menginspirasi donatur lain.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-parchment-dim shadow-sm">
            <TestimonialForm />
          </div>
        </div>
      </section>

      {/* Weave Divider */}
      <div className="weave-divider"></div>

      {/* Location & Contact Section */}
      <section className="py-20 bg-parchment-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal font-semibold text-xs tracking-wider uppercase">Hubungi Kami</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal mt-2">
              Kunjungi YAPI Medan
            </h2>
            <p className="text-lg text-ink-soft max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Pintu panti asuhan kami terbuka lebar untuk kunjungan donatur, doa bersama, maupun penyerahan santunan langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-parchment-dim shadow-sm bg-white p-2">
              <IframeMap
                latitude={3.5590454}
                longitude={98.7044167}
                zoom={16}
                height="400px"
                className="w-full rounded-md"
                title="Lokasi YAPI Medan"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-serif text-teal mb-4">
                  Sekretariat YAPI Medan
                </h3>
                <p className="text-ink-soft mb-6 text-sm leading-relaxed font-sans">
                  Hubungi kami kapan saja melalui telepon, whatsapp, atau kunjungi kantor sekretariat yayasan di dekat Air Bersih Ujung, Medan Kota.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-teal"
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
                    <h4 className="font-bold text-teal font-sans">Alamat Lengkap</h4>
                    <p className="text-ink-soft text-sm font-sans mt-0.5 leading-relaxed">
                      Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan, Sumatera Utara 20216
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-teal"
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
                    <h4 className="font-bold text-teal font-sans">Nomor Telepon & WhatsApp</h4>
                    <p className="text-ink-soft text-sm font-mono mt-0.5">0813-7058-0833</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-teal"
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
                    <h4 className="font-bold text-teal font-sans">Jam Operasional Panti</h4>
                    <p className="text-ink-soft text-sm font-sans mt-0.5">
                      Senin - Jumat: 08:00 - 17:00 WIB<br />
                      Sabtu: 08:00 - 12:00 WIB (Minggu Libur/Khusus Layanan Gereja)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://maps.google.com/maps?q=3.5590454,98.7044167"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-teal hover:bg-teal-light text-parchment font-semibold rounded-md shadow-sm transition-colors hover-scale"
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
                  Buka Rute Google Maps
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

