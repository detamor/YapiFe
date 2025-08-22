import React from 'react';
import DonationForm from '../../components/donations/DonationForm';

const DonationPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Form Donasi
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Bantu anak-anak yang membutuhkan dengan donasi Anda
          </p>
        </div>
        
        <DonationForm />
      </div>
    </div>
  );
};

export default DonationPage;







