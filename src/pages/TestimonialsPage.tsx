import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TestimonialForm from '../components/testimonials/TestimonialForm';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  date: string;
  isVerified: boolean;
}

const TestimonialsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  // Mock data testimoni (nanti bisa diambil dari API)
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      role: 'Donatur',
      message:
        'Sangat senang bisa membantu anak-anak yatim piatu melalui YAPI Medan. Program bantuan dan pendidikannya sangat terstruktur dan transparan. Saya percaya setiap donasi yang saya berikan akan memberikan dampak positif bagi masa depan anak-anak tersebut.',
      date: '15 Januari 2024',
      isVerified: true,
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      role: 'Penerima Manfaat',
      message:
        'Berkat bantuan dari YAPI Medan, saya bisa melanjutkan sekolah dan mendapatkan tempat tinggal yang layak. Tim YAPI sangat peduli dan selalu mendukung saya dalam meraih cita-cita. Terima kasih YAPI Medan!',
      date: '10 Januari 2024',
      isVerified: true,
    },
    {
      id: 3,
      name: 'Maya Sari',
      role: 'Volunteer',
      message:
        'Menjadi volunteer di YAPI Medan memberikan pengalaman yang sangat berharga. Melihat anak-anak yatim piatu tersenyum dan berkembang adalah kebahagiaan tersendiri. Program-program YAPI sangat terorganisir dan berdampak positif.',
      date: '5 Januari 2024',
      isVerified: true,
    },
    {
      id: 4,
      name: 'Budi Santoso',
      role: 'Mitra',
      message:
        'Sebagai mitra YAPI Medan, saya melihat dedikasi tinggi tim dalam membantu anak-anak yatim piatu. Program bantuan dan pendidikannya sangat terstruktur dan transparan. YAPI Medan adalah yayasan yang bisa dipercaya.',
      date: '1 Januari 2024',
      isVerified: true,
    },
  ];

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      donatur: 'Donatur',
      'penerima-manfaat': 'Penerima Manfaat',
      volunteer: 'Volunteer',
      mitra: 'Mitra/Partner',
      lainnya: 'Lainnya',
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      donatur: 'bg-green-100 text-green-800',
      'penerima-manfaat': 'bg-blue-100 text-blue-800',
      volunteer: 'bg-purple-100 text-purple-800',
      mitra: 'bg-orange-100 text-orange-800',
      lainnya: 'bg-gray-100 text-gray-800',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Testimoni Program YAPI Medan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dengarkan langsung dari donatur, penerima manfaat, volunteer, dan
            mitra tentang pengalaman mereka dengan YAPI Medan
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
                  Testimoni
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* CTA Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            {showForm ? 'Sembunyikan Form' : 'Bagikan Testimoni Anda'}
            <svg
              className={`ml-2 -mr-1 w-5 h-5 transition-transform duration-200 ${
                showForm ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Testimonial Form */}
        {showForm && (
          <div className="mb-16">
            <div className="max-w-2xl mx-auto">
              <TestimonialForm />
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        testimonial.role.toLowerCase()
                      )}`}
                    >
                      {getRoleLabel(testimonial.role)}
                    </span>
                    {testimonial.isVerified && (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-700 mb-4 italic">
                "{testimonial.message}"
              </blockquote>

              <div className="text-xs text-gray-500 text-right">
                {testimonial.date}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ingin Berbagi Pengalaman?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Testimoni Anda sangat berharga untuk membantu orang lain memahami
              dampak program YAPI Medan dalam menangani anak-anak yatim dan
              piatu. Bagikan pengalaman Anda sekarang!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              Bagikan Testimoni
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
