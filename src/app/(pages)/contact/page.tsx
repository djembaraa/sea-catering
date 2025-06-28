import React from "react";

// Komponen untuk setiap item kontak dengan ikon
const ContactInfo = ({
  icon,
  title,
  children,
}: {
  icon: JSX.Element;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-cyan-100 rounded-full text-cyan-600">
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  </div>
);

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Kami siap membantu menjawab setiap pertanyaan Anda.
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Kolom Informasi Kontak */}
            <div className="space-y-8">
              <ContactInfo
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                title="Manajer Layanan"
              >
                Brian <br />
                Siap melayani Anda.
              </ContactInfo>
              <ContactInfo
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
                title="Nomor Telepon"
              >
                08123456789
              </ContactInfo>
              <ContactInfo
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                title="Email"
              >
                contact@seacatering.com
              </ContactInfo>
            </div>

            {/* Kolom Peta */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Lokasi Kantor Pusat
              </h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4727145773623!2d106.8271730147699!3d-6.200000095509207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fd540de5!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1624888888888!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Peta Lokasi"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
