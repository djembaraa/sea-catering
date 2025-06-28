"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ISubscription {
  _id: string;
  plan: string;
  mealTypes: string[];
  deliveryDays: string[];
  totalPrice: number;
  status: "active" | "paused" | "cancelled";
  pauseStartDate?: string;
  pauseEndDate?: string;
  createdAt: string;
}

const PauseModal = ({
  subscription,
  onClose,
  onConfirm,
}: {
  subscription: ISubscription;
  onClose: () => void;
  onConfirm: (id: string, startDate: string, endDate: string) => void;
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleConfirm = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be after the start date.");
      return;
    }
    onConfirm(subscription._id, startDate, endDate);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md text-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          Jeda Langganan: {subscription.plan}
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block mb-2">
              Mulai Jeda:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block mb-2">
              Jeda Hingga:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="py-2 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            Konfirmasi Jeda
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserDashboardPage() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pausingSubscription, setPausingSubscription] =
    useState<ISubscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(
          "https://sea-catering-api.onrender.com/api/subscriptions/my",
          {
            headers: { "x-auth-token": token },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch subscriptions");
        setSubscriptions(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [router]);

  const handleUpdateStatus = async (
    id: string,
    status: "paused" | "cancelled" | "active",
    dates?: { startDate: string; endDate: string }
  ) => {
    if (
      status !== "paused" &&
      !confirm(
        `Anda yakin ingin ${
          status === "cancelled" ? "membatalkan" : "mengaktifkan kembali"
        } langganan ini?`
      )
    )
      return;
    const token = localStorage.getItem("token");
    const body: any = { status };
    if (status === "paused" && dates) {
      body.pauseStartDate = dates.startDate;
      body.pauseEndDate = dates.endDate;
    }
    try {
      const res = await fetch(
        `https://sea-catering-api.onrender.com/api/subscriptions/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token!,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error(`Gagal mengubah status langganan`);
      const updatedSub = await res.json();
      setSubscriptions((subs) =>
        subs.map((s) => (s._id === id ? updatedSub : s))
      );
      alert(`Langganan telah diubah menjadi ${status}.`);
      if (pausingSubscription) setPausingSubscription(null);
    } catch (err) {
      alert("Terjadi kesalahan.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-800 p-8">Memuat langganan Anda...</p>
    );
  if (error)
    return <p className="text-center text-red-500 p-8">Error: {error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Langganan Saya
        </h1>
        {subscriptions.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-md">
            <p className="text-gray-500 mb-4">
              Anda belum memiliki langganan aktif.
            </p>
            <Link
              href="/subscription"
              className="py-2 px-6 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >
              Langganan Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {sub.plan}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${
                      sub.status === "active"
                        ? "bg-green-100 text-green-800"
                        : sub.status === "paused"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 text-gray-600">
                  <p>
                    <strong>Harga:</strong>{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(sub.totalPrice)}{" "}
                    / bulan
                  </p>
                  <p>
                    <strong>Makanan:</strong> {sub.mealTypes.join(", ")}
                  </p>
                  <p>
                    <strong>Hari:</strong> {sub.deliveryDays.join(", ")}
                  </p>
                  {sub.status === "paused" && sub.pauseStartDate && (
                    <p className="text-yellow-600">
                      <strong>Dijeda:</strong>{" "}
                      {new Date(sub.pauseStartDate).toLocaleDateString("id-ID")}{" "}
                      hingga{" "}
                      {new Date(sub.pauseEndDate!).toLocaleDateString("id-ID")}
                    </p>
                  )}
                  <small className="block text-gray-400 pt-2">
                    Berlangganan pada:{" "}
                    {new Date(sub.createdAt).toLocaleDateString("id-ID")}
                  </small>
                </div>
                <div className="flex gap-4 mt-6">
                  {sub.status === "active" && (
                    <>
                      <button
                        onClick={() => setPausingSubscription(sub)}
                        className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      >
                        Jeda
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(sub._id, "cancelled")}
                        className="py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
                      >
                        Batalkan
                      </button>
                    </>
                  )}
                  {sub.status === "paused" && (
                    <button
                      onClick={() => handleUpdateStatus(sub._id, "active")}
                      className="py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                      Aktifkan Kembali
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {pausingSubscription && (
        <PauseModal
          subscription={pausingSubscription}
          onClose={() => setPausingSubscription(null)}
          onConfirm={(id, startDate, endDate) =>
            handleUpdateStatus(id, "paused", { startDate, endDate })
          }
        />
      )}
    </div>
  );
}
