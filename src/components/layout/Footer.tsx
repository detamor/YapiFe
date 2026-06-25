import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-teal text-parchment border-t border-teal-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/yapi.jpg"
                alt="YAPI Medan Logo"
                className="w-10 h-10 object-cover rounded-lg border border-teal-light"
              />
              <span className="ml-3 text-xl font-serif font-bold text-parchment">YAPI Medan</span>
            </div>
            <p className="text-parchment/80 mb-4 max-w-md leading-relaxed text-sm">
              YAPI Medan adalah Yayasan Advent Peduli Indonesia
              cabang Medan. Yayasan ini merupakan lembaga sosial yang bergerak
              di bidang kemanusiaan, khususnya dalam menangani anak-anak yatim
              dan piatu. YAPI Medan juga merupakan bagian dari Yayasan Advent
              Peduli Indonesia yang memiliki beberapa cabang di Indonesia.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/search/top?q=YAPI%20yayasan%20advent%20peduli%20indonesia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/60 hover:text-amber transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/yayasanadventpeduliindonesia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/60 hover:text-amber transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold mb-4 text-parchment">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm text-parchment/80">
              <li>
                <Link
                  to="/"
                  className="hover:text-amber transition-colors duration-200"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/donations"
                  className="hover:text-amber transition-colors duration-200"
                >
                  Donasi
                </Link>
              </li>
              <li>
                <Link
                  to="/children"
                  className="hover:text-amber transition-colors duration-200"
                >
                  Anak-anak
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-amber transition-colors duration-200"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold mb-4 text-parchment">Kontak</h3>
            <ul className="space-y-3 text-sm text-parchment/80">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-amber"
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
                <span>
                  Jl. Air Bersih Ujung No.98 A
                  <br />
                  Sudirejo II, Kec. Medan Kota
                  <br />
                  Kota Medan, Sumatera Utara 20216
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-amber"
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
                <span className="font-mono">0813-7058-0833</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-amber"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@yapimedan.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-teal-light">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-parchment/60 text-sm">
              © {currentYear} YAPI Medan. Semua hak dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-parchment/60 hover:text-amber text-sm transition-colors duration-200"
              >
                Kebijakan Privasi
              </Link>
              <Link
                to="/terms"
                className="text-parchment/60 hover:text-amber text-sm transition-colors duration-200"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
