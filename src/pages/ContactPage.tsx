import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import IframeMap from '../components/maps/IframeMap';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Hubungi Kami
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk
            menghubungi kami
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informasi Kontak
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Alamat
                </h3>
                <p className="text-gray-600">
                  Jl. Air Bersih Ujung No.98 A<br />
                  Sudirejo II, Kec. Medan Kota
                  <br />
                  Kota Medan, Sumatera Utara 20216
                  <br />
                  Indonesia
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Telepon
                </h3>
                <p className="text-gray-600">0813-7058-0833</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email
                </h3>
                <p className="text-gray-600">info@yapimedan.org</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Jam Kerja
                </h3>
                <p className="text-gray-600">
                  Senin - Jumat: 08:00 - 17:00
                  <br />
                  Sabtu: 08:00 - 12:00
                  <br />
                  Minggu: Tutup
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Kirim Pesan
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lokasi YAPI Medan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kunjungi kantor kami untuk melihat langsung kegiatan YAPI Medan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <IframeMap
              latitude={3.5590454}
              longitude={98.7044167}
              zoom={16}
              height="500px"
              className="w-full"
              title="Lokasi YAPI Medan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
