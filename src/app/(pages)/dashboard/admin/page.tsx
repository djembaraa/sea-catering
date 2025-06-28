// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";

// interface IMetrics {
//   newSubscriptions: number;
//   monthlyRecurringRevenue: number;
//   reactivations: number;
//   subscriptionGrowth: number;
// }

// // Komponen Kartu Statistik dengan tema terang
// const StatCard = ({
//   title,
//   value,
// }: {
//   title: string;
//   value: string | number;
// }) => (
//   <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//     <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
//       {title}
//     </h3>
//     <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//   </div>
// );

// // Fungsi untuk format tanggal ke YYYY-MM-DD
// const formatDateForInput = (date: Date): string => {
//   return date.toISOString().split("T")[0];
// };

// export default function AdminDashboardPage() {
//   const [metrics, setMetrics] = useState<IMetrics | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [dateRange, setDateRange] = useState({
//     start: formatDateForInput(
//       new Date(new Date().setDate(new Date().getDate() - 30))
//     ),
//     end: formatDateForInput(new Date()),
//   });
//   const router = useRouter();

//   const fetchMetrics = useCallback(
//     async (start: string, end: string) => {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/admin/metrics?startDate=${start}&endDate=${end}`,
//           {
//             headers: { "x-auth-token": token },
//           }
//         );
//         if (res.status === 403) {
//           alert("Access Denied. You are not an admin.");
//           router.push("/dashboard/user");
//           return;
//         }
//         if (!res.ok) throw new Error("Failed to fetch metrics");
//         const data = await res.json();
//         setMetrics(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [router]
//   );

//   useEffect(() => {
//     // Validasi agar end date tidak lebih dulu dari start date
//     if (new Date(dateRange.end) < new Date(dateRange.start)) {
//       return;
//     }
//     fetchMetrics(dateRange.start, dateRange.end);
//   }, [dateRange, fetchMetrics]);

//   return (
//     <div className="bg-gray-50 text-gray-800 min-h-screen p-8 md:p-12">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">
//           Admin Dashboard
//         </h1>

//         {/* Date Range Selector */}
//         <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-md border border-gray-200">
//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="font-semibold text-gray-600">
//               From:
//             </label>
//             <input
//               type="date"
//               id="startDate"
//               value={dateRange.start}
//               onChange={(e) =>
//                 setDateRange((d) => ({ ...d, start: e.target.value }))
//               }
//               className="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="font-semibold text-gray-600">
//               To:
//             </label>
//             <input
//               type="date"
//               id="endDate"
//               value={dateRange.end}
//               onChange={(e) =>
//                 setDateRange((d) => ({ ...d, end: e.target.value }))
//               }
//               className="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
//             />
//           </div>
//         </div>

//         {loading ? (
//           <p className="text-center text-gray-600">Loading metrics...</p>
//         ) : !metrics ? (
//           <p className="text-center text-red-600">
//             Could not load metrics. Please try again.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <StatCard
//               title="New Subscriptions"
//               value={metrics.newSubscriptions}
//             />
//             <StatCard
//               title="Monthly Recurring Revenue"
//               value={new Intl.NumberFormat("id-ID", {
//                 style: "currency",
//                 currency: "IDR",
//                 minimumFractionDigits: 0,
//               }).format(metrics.monthlyRecurringRevenue)}
//             />
//             <StatCard title="Reactivations" value={metrics.reactivations} />
//             <StatCard
//               title="Total Active Subscriptions"
//               value={metrics.subscriptionGrowth}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// Tipe data yang lebih detail untuk kebutuhan admin
interface IUser {
  _id: string;
  fullName: string;
  email: string;
}
interface IAdminSubscription {
  _id: string;
  user: IUser;
  plan: string;
  status: "active" | "paused" | "cancelled";
  totalPrice: number;
  createdAt: string;
  phone: string;
}
interface IMetrics {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  subscriptionGrowth: number;
}

// Komponen Modal untuk Edit
const EditSubscriptionModal = ({
  sub,
  onClose,
  onSave,
}: {
  sub: IAdminSubscription;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
}) => {
  const [status, setStatus] = useState(sub.status);
  const [phone, setPhone] = useState(sub.phone);

  const handleSave = () => {
    onSave(sub._id, { status, phone });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg text-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Subscription</h2>
        <p className="mb-2">
          <strong>Customer:</strong> {sub.user.fullName} ({sub.user.email})
        </p>
        <p className="mb-6">
          <strong>Plan:</strong> {sub.plan}
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block mb-2 font-semibold">
              Phone Number:
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="status" className="block mb-2 font-semibold">
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as IAdminSubscription["status"])
              }
              className="w-full p-2 rounded-lg border border-gray-300"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen Halaman Utama
export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<IMetrics | null>(null);
  const [subscriptions, setSubscriptions] = useState<IAdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubscription, setEditingSubscription] =
    useState<IAdminSubscription | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Ambil kedua data (metrics dan subscriptions) secara bersamaan
      const [metricsRes, subsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/metrics", {
          headers: { "x-auth-token": token },
        }),
        fetch("http://localhost:5000/api/admin/subscriptions", {
          headers: { "x-auth-token": token },
        }),
      ]);

      if (metricsRes.status === 403 || subsRes.status === 403) {
        alert("Access Denied. You are not an admin.");
        router.push("/dashboard/user");
        return;
      }

      if (!metricsRes.ok || !subsRes.ok)
        throw new Error("Failed to fetch admin data");

      setMetrics(await metricsRes.json());
      setSubscriptions(await subsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSubscription = async (id: string, data: any) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/subscriptions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token!,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to update subscription");
      const updatedSub = await res.json();
      setSubscriptions((subs) =>
        subs.map((s) => (s._id === id ? updatedSub : s))
      );
      alert("Subscription updated successfully!");
      setEditingSubscription(null);
    } catch (err) {
      alert("An error occurred during update.");
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : status === "paused"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Bagian Metrik */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Business Metrics
          </h2>
          {loading ? (
            <p>Loading metrics...</p>
          ) : (
            metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-sm text-gray-500">New Subscriptions</h3>
                  <p className="text-3xl font-bold mt-2">
                    {metrics.newSubscriptions}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-sm text-gray-500">
                    Monthly Recurring Revenue
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(metrics.monthlyRecurringRevenue)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-sm text-gray-500">Reactivations</h3>
                  <p className="text-3xl font-bold mt-2">
                    {metrics.reactivations}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-sm text-gray-500">
                    Total Active Subscriptions
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {metrics.subscriptionGrowth}
                  </p>
                </div>
              </div>
            )
          )}
        </section>

        {/* Bagian Tabel Langganan */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            All Subscriptions
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Plan</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Loading subscriptions...
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="font-medium">{sub.user.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {sub.user.email}
                        </div>
                      </td>
                      <td className="p-4">{sub.plan}</td>
                      <td className="p-4">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(sub.totalPrice)}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="p-4">
                        {new Date(sub.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setEditingSubscription(sub)}
                          className="text-cyan-600 hover:text-cyan-800 font-semibold"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {editingSubscription && (
        <EditSubscriptionModal
          sub={editingSubscription}
          onClose={() => setEditingSubscription(null)}
          onSave={handleSaveSubscription}
        />
      )}
    </div>
  );
}
