import React from 'react';
import { Child } from '../../types';
import { calculateAge } from '../../utils/dateUtils';

interface ChildCardProps {
  child: Child;
}

const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  const age = calculateAge(child.dateOfBirth);
  const mainImage = child.images?.[0] || '';

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={mainImage}
          alt={child.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
          }}
        />
        {child.isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
              child.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
            }`}
          >
            {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
          <span className="text-lg font-medium text-indigo-600">
            {age} tahun
          </span>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>{child.currentStatus.living}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{child.currentStatus.health}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>{child.currentStatus.education}</span>
            </div>
          </div>
        </div>

        {child.skills && child.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Kemampuan
            </h4>
            <div className="flex flex-wrap gap-2">
              {child.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {child.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{child.skills.length - 3} lagi
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Cerita</h4>
          <p className="text-sm text-gray-600 line-clamp-3">{child.story}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Bergabung sejak{' '}
            {new Date(child.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
          <button className="btn-primary text-sm px-4 py-2">
            Bantu Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildCard;
