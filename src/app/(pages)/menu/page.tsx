"use client";

import React, { useState } from "react";

interface MealPlan {
  name: string;
  price: string;
  description: string;
  longDescription: string;
  image: string;
}

const mealPlans: MealPlan[] = [
  {
    name: "Diet Plan",
    price: "Rp30.000",
    description:
      "Rendah kalori, tinggi serat, untuk program penurunan berat badan.",
    longDescription:
      "Paket Diet Plan kami dirancang oleh ahli gizi untuk memastikan asupan kalori terkontrol tanpa mengorbankan rasa. Setiap hidangan kaya akan serat dari sayuran segar dan protein tanpa lemak untuk membuat Anda kenyang lebih lama.",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800",
  },
  {
    name: "Protein Plan",
    price: "Rp40.000",
    description: "Tinggi protein untuk membangun massa otot dan pemulihan.",
    longDescription:
      "Sempurna bagi Anda yang aktif berolahraga. Protein Plan menyediakan protein berkualitas tinggi dari sumber seperti dada ayam, ikan salmon, dan telur untuk membantu perbaikan dan pertumbuhan otot secara maksimal.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800",
  },
  {
    name: "Royal Plan",
    price: "Rp60.000",
    description: "Menu premium dengan bahan organik dan resep dari chef.",
    longDescription:
      "Nikmati pengalaman kuliner sehat terbaik dengan Royal Plan. Kami hanya menggunakan bahan-bahan organik pilihan dan resep eksklusif yang diracik oleh chef berpengalaman untuk memanjakan lidah Anda setiap hari.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800",
  },
];

// Komponen Modal dengan tema terang
const MealPlanModal = ({
  plan,
  onClose,
}: {
  plan: MealPlan;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full text-gray-800 shadow-2xl overflow-hidden">
        <img
          src={plan.image}
          alt={plan.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-3xl font-bold text-cyan-600">{plan.name}</h2>
          <p className="text-xl text-gray-700 my-2">{plan.price} / meal</p>
          <p className="text-gray-600 leading-relaxed mt-4">
            {plan.longDescription}
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MenuPage() {
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Paket Meal Plan Kami
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Pilih paket yang paling sesuai dengan tujuan kesehatan Anda.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealPlans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <img
                src={plan.image}
                alt={plan.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-gray-800">
                  {plan.name}
                </h2>
                <p className="text-lg text-cyan-600 font-semibold mt-1">
                  {plan.price} / meal
                </p>
                <p className="text-gray-600 mt-4 flex-grow">
                  {plan.description}
                </p>
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="mt-6 w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPlan && (
        <MealPlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}
