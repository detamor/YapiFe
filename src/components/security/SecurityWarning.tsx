import React from 'react';
import { useSecurity } from '../../contexts/SecurityContext';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const SecurityWarning: React.FC = () => {
  const {
    showSecurityWarning,
    sessionAge,
    sessionTimeout,
    refreshSession,
    endSession,
  } = useSecurity();

  if (!showSecurityWarning) return null;

  const remainingTime = Math.max(0, sessionTimeout - sessionAge);
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Peringatan Keamanan
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Sesi Anda akan berakhir dalam{' '}
                <span className="font-semibold">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </p>
              <p className="mt-1">Klik "Perpanjang Sesi" untuk tetap login</p>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={refreshSession}
                className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                Perpanjang Sesi
              </button>
              <button
                onClick={endSession}
                className="bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={() => {
                /* Hide warning temporarily */
              }}
              className="text-yellow-400 hover:text-yellow-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityWarning;



