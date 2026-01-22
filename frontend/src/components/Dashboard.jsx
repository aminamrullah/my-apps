import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

const cards = [
  {
    id: "jamaahs",
    label: "Jamaah Terdaftar",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "packages",
    label: "Paket Umrah",
    color: "from-green-500 to-green-600",
  },
  {
    id: "employees",
    label: "Pegawai Operasional",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "bookings",
    label: "Booking Aktif",
    color: "from-yellow-500 to-yellow-600",
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }
    fetchStats(storedToken);
  };

  const fetchStats = async (token) => {
    try {
      setLoading(true);
      const [jamaahRes, packageRes, employeeRes, bookingRes] =
        await Promise.all([
          axios.get(`${API_BASE}/jamaahs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/packages`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/employees`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      const jamaahs = jamaahRes.data?.data || [];
      const packages = packageRes.data?.data || [];
      const employees = employeeRes.data?.data || [];
      const bookings = bookingRes.data?.data || [];

      setStats({
        jamaahs: jamaahs.length,
        packages: packages.length,
        employees: employees.length,
        bookings: bookings.length,
      });
      setRecentBookings(bookings.slice(-4).reverse());
    } catch (error) {
      if (error.response) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading || !stats) {
    return (
      <div className="container mx-auto mt-10">
        <div className="text-center text-gray-600 py-12">
          Memuat dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Sistem Umrah
          </h1>
          <p className="text-gray-600 mt-1">
            Pantau jumlah jamaah, paket, pegawai, dan booking secara real-time.
          </p>
        </div>
        {/* <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-semibold"
        >
          Logout
        </button> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`p-6 rounded-3xl shadow-lg text-white bg-gradient-to-br ${card.color}`}
          >
            <p className="text-sm uppercase tracking-wider">{card.label}</p>
            <p className="text-4xl font-bold mt-3">{stats[card.id] ?? 0}</p>
            <p className="text-sm mt-2 text-white/80">
              Dibandingkan bulan lalu, data ini terus diperbarui oleh sistem.
            </p>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-3xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Terbaru
            </h2>
            <p className="text-sm text-gray-500">
              Data booking aktif yang baru muncul di sistem.
            </p>
          </div>
          <span className="text-xs uppercase tracking-wider text-gray-500">
            4 terakhir
          </span>
        </div>
        {recentBookings.length ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-2xl p-4"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    Booking ID #{booking.id}
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Jamaah #{booking.jamaahId} - Paket #{booking.packageId}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                    {booking.status}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Belum ada booking terbaru.
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
