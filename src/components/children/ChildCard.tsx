import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Child } from '../../types';
import { calculateAge } from '../../utils/dateUtils';

interface ChildCardProps {
  child: Child;
}

const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  const navigate = useNavigate();
  const age = calculateAge(child.dateOfBirth);
  const mainImage = child.images?.[0] || '';

  // isSponsored is stored in child.isFeatured (mapped from child.sponsorship.isSponsored)
  const isSponsored = child.isFeatured;

  return (
    <div className="card bg-white border border-parchment-dim hover-scale flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      {/* Profile Image & Badges */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={
            !mainImage
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
              : mainImage.startsWith('http') || mainImage.startsWith('/') || mainImage.startsWith('data:')
              ? mainImage
              : `/uploads/${mainImage}`
          }
          alt={child.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
          }}
        />
        {/* Gender Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm ${
              child.gender === 'male' ? 'bg-teal-light' : 'bg-coral'
            }`}
          >
            {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
          </span>
        </div>
        {/* Urgency Badge if not sponsored */}
        {!isSponsored && (
          <div className="absolute top-3 right-3">
            <span className="bg-coral text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
              Butuh Sponsor
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Name & Age */}
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-xl font-bold text-teal font-serif leading-tight">{child.name}</h3>
          <span className="text-sm font-mono text-ink-soft bg-parchment px-2 py-0.5 rounded">
            {age} tahun
          </span>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 bg-teal/10 text-teal text-xs font-medium rounded">
            {child.currentStatus.living}
          </span>
          <span className="px-2 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded">
            {child.currentStatus.health}
          </span>
          <span className="px-2 py-0.5 bg-amber/10 text-amber text-xs font-medium rounded">
            Kelas: {child.currentStatus.education}
          </span>
        </div>

        {/* Story Snippet */}
        <p className="text-sm text-ink-soft font-sans line-clamp-3 mb-6 flex-grow leading-relaxed">
          {child.story}
        </p>

        {/* Sponsorship Weave Progress Bar */}
        <div className="mb-6 pt-4 border-t border-parchment-dim">
          <div className="flex justify-between text-xs font-semibold text-ink-soft mb-1.5">
            <span>Progress Sponsorship</span>
            <span className="font-mono text-teal">
              {isSponsored ? '100% (Disponsori)' : 'Butuh Dukungan'}
            </span>
          </div>
          <div className="weave-bar">
            <div
              className="weave-bar-fill"
              style={{ width: isSponsored ? '100%' : '15%' }}
            ></div>
          </div>
          <p className="text-xs text-ink-soft/75 mt-1.5 leading-relaxed">
            {isSponsored 
              ? 'Telah dibantu oleh sponsor untuk pendidikan & biaya hidup.'
              : 'Sangat memerlukan sponsor bulanan senilai Rp 500.000.'}
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex gap-3 mt-auto">
          <Link
            to={`/children/${child.id}`}
            className="flex-1 text-center py-2 px-3 border border-teal text-teal text-sm font-semibold rounded-md hover:bg-teal/5 transition-colors"
          >
            Kisah Lengkap
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
};

export default ChildCard;
