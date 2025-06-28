"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";

interface IFormData {
  name: string;
  phone: string;
  plan: "Diet Plan" | "Protein Plan" | "Royal Plan";
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
}

const planPrices = {
  "Diet Plan": 30000,
  "Protein Plan": 40000,
  "Royal Plan": 60000,
};
const mealOptions = ["Breakfast", "Lunch", "Dinner"];
const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<IFormData>({
    name: "Loading...",
    phone: "",
    plan: "Diet Plan",
    mealTypes: [],
    deliveryDays: [],
    allergies: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to subscribe.");
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(
          "https://sea-catering-api.onrender.com/api/auth/me",
          {
            headers: { "x-auth-token": token },
          }
        );
        if (!res.ok) throw new Error("Session expired, please login again.");
        const userData = await res.json();
        setFormData((prev) => ({ ...prev, name: userData.fullName }));
      } catch (err: any) {
        alert(err.message);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };
    fetchUserData();
  }, [router]);

  useEffect(() => {
    const { plan, mealTypes, deliveryDays } = formData;
    const price = planPrices[plan] || 0;
    const numMeals = mealTypes.length;
    const numDays = deliveryDays.length;
    const calculatedPrice = price * numMeals * numDays * 4.3;
    setTotalPrice(calculatedPrice);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const currentValues = prev[name as keyof IFormData] as string[];
      if (checked) return { ...prev, [name]: [...currentValues, value] };
      return {
        ...prev,
        [name]: currentValues.filter((item) => item !== value),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (
      !formData.phone ||
      formData.mealTypes.length === 0 ||
      formData.deliveryDays.length === 0
    ) {
      setError("Please fill in all required fields (*).");
      return;
    }
    const token = localStorage.getItem("token");
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://sea-catering-api.onrender.com/api/subscriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token!,
          },
          body: JSON.stringify({ ...formData, totalPrice }),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "An unknown error occurred.");
      alert("Subscription successful! We will contact you shortly.");
      router.push("/dashboard/user");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 md:p-12">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Buat Langganan Anda
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 font-semibold text-gray-700"
            >
              Nama Lengkap*
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              required
              disabled
              className="w-full p-3 rounded-lg bg-gray-200 border border-gray-300 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 font-semibold text-gray-700"
            >
              No. HP Aktif*
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 08123456789"
            />
          </div>
          <div>
            <label
              htmlFor="plan"
              className="block mb-2 font-semibold text-gray-700"
            >
              Pilih Paket*
            </label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {Object.keys(planPrices).map((p) => (
                <option key={p} value={p}>
                  {p} -{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(planPrices[p as keyof typeof planPrices])}
                  /meal
                </option>
              ))}
            </select>
          </div>
          <fieldset className="border border-gray-300 p-4 rounded-lg">
            <legend className="px-2 font-semibold text-gray-700">
              Tipe Makanan*
            </legend>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 pt-2">
              {mealOptions.map((meal) => (
                <label
                  key={meal}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="mealTypes"
                    value={meal}
                    checked={formData.mealTypes.includes(meal)}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-gray-700">{meal}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded-lg">
            <legend className="px-2 font-semibold text-gray-700">
              Hari Pengiriman*
            </legend>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 pt-2">
              {dayOptions.map((day) => (
                <label
                  key={day}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="deliveryDays"
                    value={day}
                    checked={formData.deliveryDays.includes(day)}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label
              htmlFor="allergies"
              className="block mb-2 font-semibold text-gray-700"
            >
              Alergi (opsional)
            </label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., kacang, makanan laut"
            />
          </div>
          <div className="text-2xl font-bold text-right text-gray-800 pt-4 border-t border-gray-200">
            Total Harga:{" "}
            <span className="text-cyan-600">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(totalPrice)}{" "}
              / bulan
            </span>
          </div>
          {error && (
            <p className="text-red-600 text-center bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || formData.name === "Loading..."}
            className="w-full py-4 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Memproses..." : "Langganan Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}
