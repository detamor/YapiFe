import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Donasi', href: '/donations' },
    { name: 'Anak-anak', href: '/children' },
    { name: 'Dokumentasi', href: '/activities' },
    { name: 'Testimoni', href: '/testimonials' },
    { name: 'Kontak', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-teal shadow-md border-b border-teal-light z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center">
                <img
                  src="/yapi.jpg"
                  alt="YAPI Medan Logo"
                  className="w-10 h-10 object-cover rounded-lg border border-teal-light"
                />
                <span className="ml-3 text-xl font-serif font-bold text-parchment">
                  YAPI Medan
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-amber bg-teal-light shadow-sm'
                    : 'text-parchment/80 hover:text-amber hover:bg-teal-light'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-parchment/80 hover:text-amber px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {(user?.role === 'donatur' || user?.role === 'volunteer') && (
                  <Link
                    to="/donatur"
                    className="text-parchment/80 hover:text-amber px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-parchment hover:text-amber px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none">
                    <span>{user?.name}</span>
                    <svg
                      className="w-4 h-4"
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
                  <div className="absolute right-0 mt-2 w-48 bg-teal border border-teal-light rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block w-full text-left px-4 py-2 text-sm text-parchment/80 hover:text-amber hover:bg-teal-light transition-colors"
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-parchment/80 hover:text-amber hover:bg-teal-light transition-colors border-t border-teal-light/20"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-parchment/80 hover:text-amber px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-amber text-ink px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-dark transition-all duration-200 shadow-sm"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-parchment/80 hover:text-amber p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-teal border-t border-teal-light">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-amber bg-teal-light'
                    : 'text-parchment/80 hover:text-amber hover:bg-teal-light'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-parchment/80 hover:text-amber hover:bg-teal-light"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="pt-4 pb-3 border-t border-teal-light">
                  <div className="px-3 py-2 text-sm font-medium text-amber">
                    {user?.name}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-parchment/80 hover:text-amber hover:bg-teal-light"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profil Saya
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-parchment/80 hover:text-amber hover:bg-teal-light"
                  >
                    Keluar
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 pb-3 border-t border-teal-light space-y-2">
                <Link
                  to="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-parchment/80 hover:text-amber hover:bg-teal-light"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-3 py-2 rounded-md text-base font-semibold bg-amber text-ink text-center hover:bg-amber-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
