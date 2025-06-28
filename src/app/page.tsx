"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Definisikan tipe data untuk testimoni
interface ITestimonial {
  _id: string;
  name: string;
  review: string;
  rating: number;
}

// Komponen untuk Bintang Rating
const StarRating = ({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) => (
  <div className={`flex text-yellow-400 ${className}`}>
    {[...Array(5)].map((_, index) => (
      <span key={index}>{index < rating ? "★" : "☆"}</span>
    ))}
  </div>
);

// Komponen untuk Kartu Fitur
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 text-cyan-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [formData, setFormData] = useState({ name: "", review: "", rating: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentYear, setCurrentYear] = useState<number | "">("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          "https://sea-catering-api.onrender.com/api/testimonials"
        );
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Fetch testimonials error:", err);
      }
    };
    fetchTestimonials();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.review || formData.rating === 0) {
      setError("Please fill all fields.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(
        "https://sea-catering-api.onrender.com/api/testimonials",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const newTestimonial = await res.json();
      if (!res.ok)
        throw new Error(newTestimonial.msg || "Something went wrong");
      setTestimonials((prev) => [newTestimonial, ...prev]);
      setFormData({ name: "", review: "", rating: 0 });
      alert("Thank you for your review!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[60vh] md:h-[80vh] flex flex-col items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 p-4">
          {/* INI BAGIAN NAMA & SLOGAN DARI LEVEL 1 */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            SEA Catering
          </h1>
          <p className="text-xl md:text-2xl mt-4 italic text-gray-200">
            “Healthy Meals, Anytime, Anywhere”
          </p>

          <Link
            href="/menu"
            className="mt-8 inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105"
          >
            Lihat Paket Kami
          </Link>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-8 md:p-12 space-y-24">
        {/* INI BAGIAN WELCOMING SECTION DARI LEVEL 1 */}
        <section id="welcome" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Selamat Datang di SEA Catering!
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            SEA Catering adalah layanan katering makanan sehat yang dapat
            disesuaikan dengan kebutuhan Anda, dengan pengiriman ke seluruh kota
            besar di Indonesia. Kami hadir untuk membuat hidup sehat lebih mudah
            dan lezat untuk Anda.
          </p>
        </section>

        {/* INI BAGIAN FITUR DARI LEVEL 1 */}
        <section id="features">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Layanan Unggulan Kami
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 16v-2m0-8v-2M4 12H2m16 0h-2M6 18l-2-2m16-12l-2-2M6 6l2-2m12 12l2 2"
                  />
                </svg>
              }
              title="Meal Customization"
              description="Sesuaikan menu makanan sesuai selera dan kebutuhan kalori harian Anda."
            />
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
              }
              title="Delivery to Major Cities"
              description="Jangkauan pengiriman luas ke seluruh kota besar di Indonesia."
            />
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="Detailed Nutritional Info"
              description="Informasi gizi lengkap dan transparan untuk setiap hidangan."
            />
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Flexible Subscription"
              description="Mulai, jeda, atau batalkan langganan Anda kapan saja dengan mudah."
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Apa Kata Pelanggan Setia Kami?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.length > 0 ? (
              testimonials.slice(0, 4).map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white p-8 rounded-xl shadow-lg"
                >
                  <p className="italic text-gray-600 text-lg">
                    "{testimonial.review}"
                  </p>
                  <div className="flex items-center mt-6">
                    <div className="ml-4">
                      <p className="font-bold text-gray-800">
                        - {testimonial.name}
                      </p>
                      <StarRating
                        rating={testimonial.rating}
                        className="text-lg"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center md:col-span-2">
                Jadilah yang pertama memberikan ulasan!
              </p>
            )}
          </div>
        </section>

        {/* INI BAGIAN KONTAK DARI LEVEL 1 */}
        <section
          id="contact"
          className="bg-white p-8 md:p-12 rounded-xl shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Hubungi Kami
          </h2>
          <div className="text-center text-lg text-gray-600">
            <p>Punya pertanyaan? Jangan ragu untuk menghubungi manajer kami.</p>
            <div className="mt-4 font-semibold text-gray-800">
              <p>Manager: Brian</p>
              <p>Phone Number: 08123456789</p>
            </div>
          </div>
        </section>

        {/* Testimonial Form Section */}
        <section
          id="testimonial-form"
          className="bg-cyan-50 p-8 md:p-12 rounded-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Bagikan Pengalaman Anda
          </h2>
          <form
            onSubmit={handleTestimonialSubmit}
            className="space-y-6 max-w-xl mx-auto"
          >
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold">
                Nama Anda
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label htmlFor="review" className="block mb-2 font-semibold">
                Ulasan Anda
              </label>
              <textarea
                name="review"
                id="review"
                value={formData.review}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="rating" className="block mb-2 font-semibold">
                Beri Rating
              </label>
              <select
                name="rating"
                id="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value={0} disabled>
                  Pilih bintang...
                </option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} Bintang {"★".repeat(star)}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Testimoni"}
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-24">
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p>&copy; {currentYear} SEA Catering. All Rights Reserved.</p>
          <p className="text-gray-400 mt-2">
            Healthy Meals, Anytime, Anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
