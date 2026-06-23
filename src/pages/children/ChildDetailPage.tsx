import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SparklesIcon, TrophyIcon, HeartIcon } from '@heroicons/react/24/outline';
import { childrenService } from '../../services/children';
import { calculateAge } from '../../utils/dateUtils';

const ChildDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<any>(null);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChildDetail = async () => {
      if (!id) return;
      try {
        const response = await childrenService.getById(id);
        console.log('📊 Child detail API response:', response);
        
        // Handle flexible response data formats
        const responseData = response.data as any;
        if (responseData && responseData.child) {
          setChild(responseData.child);
          setRecentDonations(responseData.recentDonations || []);
        } else {
          setChild(responseData);
        }
      } catch (err) {
        console.error('Error fetching child detail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChildDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-parchment min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="bg-parchment min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-parchment-dim shadow-sm">
          <svg className="mx-auto h-12 w-12 text-coral mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold font-serif text-teal mb-2">Anak Tidak Ditemukan</h2>
          <p className="text-ink-soft mb-6 text-sm">
            Data profil anak asuh tidak dapat dimuat atau telah dihapus oleh administrator.
          </p>
          <Link to="/children" className="btn-primary text-sm px-6 py-2">
            Kembali ke Daftar Anak
          </Link>
        </div>
      </div>
    );
  }

  const age = calculateAge(child.dateOfBirth);
  const mainImage = child.images?.[0]?.url || child.images?.[0] || '';
  const isSponsored = child.sponsorship?.isSponsored;

  return (
    <div className="bg-parchment min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link to="/children" className="inline-flex items-center text-teal hover:text-teal-light font-semibold text-sm transition-colors group">
            <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Kembali ke Daftar Anak Asuh
          </Link>
        </div>

        {/* Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Image Card & Sponsorship Progress */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-parchment-dim overflow-hidden shadow-sm p-4">
              <div className="relative aspect-square w-full rounded-md overflow-hidden bg-gray-100 mb-4">
                <img
                  src={!mainImage ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' : (mainImage.startsWith('http') || mainImage.startsWith('/') ? mainImage : `/uploads/${mainImage}`)}
                  alt={child.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                  }}
                />
              </div>

              <div className="text-center pb-2">
                <h1 className="text-2xl font-bold text-teal font-serif">{child.name}</h1>
                <p className="text-sm text-ink-soft mt-1">Nama Panggilan: <span className="font-semibold text-teal">{child.nickname || child.name}</span></p>
              </div>

              {/* Sponsorship Status Weave Bar */}
              <div className="mt-4 pt-4 border-t border-parchment-dim">
                <div className="flex justify-between text-xs font-semibold text-ink-soft mb-1.5">
                  <span>Status Sponsorship</span>
                  <span className="font-mono text-teal">
                    {isSponsored ? '100% (Disponsori)' : 'Butuh Sponsor'}
                  </span>
                </div>
                <div className="weave-bar">
                  <div
                    className="weave-bar-fill"
                    style={{ width: isSponsored ? '100%' : '15%' }}
                  ></div>
                </div>
                
                <div className="mt-4 p-3 rounded-md text-xs leading-relaxed text-left bg-parchment-dim border border-parchment-dim/70">
                  {isSponsored ? (
                    <p className="text-teal font-medium">
                      ✨ Terima kasih! Anak asuh ini telah memiliki sponsor aktif yang mendanai biaya kehidupan & sekolahnya.
                    </p>
                  ) : (
                    <p className="text-coral font-medium">
                      ⚠️ Anak asuh ini sangat membutuhkan sponsor tetap bulanan senilai Rp 500.000 untuk menunjang sekolahnya.
                    </p>
                  )}
                </div>

                {!isSponsored && (
                  <Link
                    to={`/donations?childId=${child._id || child.id}&childName=${encodeURIComponent(child.name)}&category=sponsorship`}
                    className="mt-4 w-full block text-center py-3 px-4 bg-amber hover:bg-amber-dark text-ink font-semibold rounded-md shadow-sm transition-colors hover-scale text-sm"
                  >
                    Sponsori Sekarang
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Status Attributes Card */}
            <div className="bg-white rounded-lg border border-parchment-dim p-6 shadow-sm">
              <h3 className="text-lg font-bold text-teal font-serif border-b border-parchment-dim pb-3 mb-4">
                Informasi Singkat
              </h3>
              <dl className="space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Jenis Kelamin</dt>
                  <dd className="font-semibold text-teal capitalize">{child.gender === 'laki-laki' || child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Umur</dt>
                  <dd className="font-semibold text-teal">{age} tahun</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Status Tinggal</dt>
                  <dd className="font-semibold text-teal">{child.currentStatus?.livingStatus === 'di-yayasan' ? 'Di Yayasan' : 'Keluarga Asuh'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Pendidikan</dt>
                  <dd className="font-semibold text-teal">{child.currentStatus?.educationLevel?.toUpperCase() || child.currentStatus?.grade || 'SD'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Kondisi Kesehatan</dt>
                  <dd className="font-semibold text-teal capitalize">{child.currentStatus?.healthStatus || 'Sehat'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Status Asal</dt>
                  <dd className="font-semibold text-teal capitalize">{child.background?.familyStatus?.replace('-', ' ') || 'Yatim'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column: Full Profile Story, Skills, Achievements, Donors */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Story Section */}
            <div className="bg-white rounded-lg border border-parchment-dim p-8 shadow-sm">
              <h2 className="text-2xl font-bold font-serif text-teal border-b border-parchment-dim pb-3 mb-4 flex items-center">
                <HeartIcon className="w-6 h-6 mr-2.5 text-amber" />
                Kisah & Latar Belakang
              </h2>
              <div className="text-ink-soft text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line">
                {child.background?.story || child.story}
              </div>
            </div>

            {/* Skills & Achievements Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Skills */}
              <div className="bg-white rounded-lg border border-parchment-dim p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-teal font-serif border-b border-parchment-dim pb-3 mb-4 flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-sage" />
                  Keterampilan & Bakat
                </h3>
                {child.skills && child.skills.length > 0 ? (
                  <div className="space-y-3 flex-grow">
                    {child.skills.map((skill: any, index: number) => (
                      <div key={index} className="p-3 bg-sage/5 rounded-md border border-sage/10 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-teal">{skill.name}</span>
                          <span className="px-2 py-0.5 bg-sage text-white rounded text-[10px] uppercase font-semibold">
                            {skill.level || 'pemula'}
                          </span>
                        </div>
                        {skill.description && <p className="text-ink-soft mt-1 leading-relaxed">{skill.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink-soft text-sm italic flex-grow flex items-center justify-center py-6">
                    Belum ada catatan bakat khusus yang diunggah.
                  </p>
                )}
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-lg border border-parchment-dim p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-teal font-serif border-b border-parchment-dim pb-3 mb-4 flex items-center">
                  <TrophyIcon className="w-5 h-5 mr-2 text-amber" />
                  Pencapaian & Prestasi
                </h3>
                {child.achievements && child.achievements.length > 0 ? (
                  <div className="space-y-3 flex-grow">
                    {child.achievements.map((achievement: any, index: number) => (
                      <div key={index} className="p-3 bg-amber/5 rounded-md border border-amber/10 text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-teal">{achievement.title}</span>
                          <span className="text-[10px] text-ink-soft font-mono ml-2 flex-shrink-0">
                            {achievement.date ? new Date(achievement.date).getFullYear() : ''}
                          </span>
                        </div>
                        {achievement.description && <p className="text-ink-soft mt-1 leading-relaxed">{achievement.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink-soft text-sm italic flex-grow flex items-center justify-center py-6">
                    Belum ada catatan pencapaian khusus.
                  </p>
                )}
              </div>
            </div>

            {/* Weave Divider */}
            <div className="weave-divider my-2"></div>

            {/* Donation / Support History Section */}
            <div className="bg-white rounded-lg border border-parchment-dim p-8 shadow-sm">
              <h3 className="text-xl font-bold text-teal font-serif border-b border-parchment-dim pb-3 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Riwayat Dukungan Benang Harapan
              </h3>
              
              {recentDonations && recentDonations.length > 0 ? (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-parchment-dim">
                    {recentDonations.map((donation: any, index: number) => {
                      const donorName = donation.donaturInfo?.isAnonymous 
                        ? 'Donatur Anonim' 
                        : (donation.donaturInfo?.name || 'Donatur Umum');
                      
                      return (
                        <li key={index} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-teal truncate">
                                {donorName}
                              </p>
                              <p className="text-xs text-ink-soft mt-0.5">
                                Dukungan dikirim pada{' '}
                                <span className="font-mono">
                                  {new Date(donation.createdAt).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              </p>
                            </div>
                            <div className="inline-flex items-center text-sm font-bold font-mono text-teal bg-parchment px-3 py-1 rounded">
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0
                              }).format(donation.amount)}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8 bg-parchment/20 border border-dashed border-parchment-dim rounded-md">
                  <p className="text-ink-soft text-sm italic">
                    Belum ada riwayat dukungan tercatat. Mari menjadi yang pertama memberi dukungan.
                  </p>
                  <Link
                    to={`/donations?childId=${child._id || child.id}&childName=${encodeURIComponent(child.name)}&category=sponsorship`}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-teal text-teal hover:bg-teal/5 text-xs font-semibold rounded transition-colors"
                  >
                    Mulai Dukung {child.nickname || child.name}
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ChildDetailPage;
