import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import PanelLayout from "./PanelLayout";

const cards = [
  {
    id: "jamaahs",
    label: "Jamaah Terdaftar",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    id: "packages",
    label: "Paket Umrah",
    color: "bg-gradient-to-br from-green-500 to-green-600",
  },
  {
    id: "employees",
    label: "Pegawai Operasional",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  {
    id: "bookings",
    label: "Booking Aktif",
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
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
    <div className="space-y-8">
      <PanelLayout
        title="Dashboard Sistem Umrah"
        subtitle="Pantau jamaah, paket, pegawai, dan booking dengan tampilan interaktif yang selalu up-to-date."
        accent="Ringkasan"
        badge="Realtime"
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl border border-white/30 p-5 shadow-xl backdrop-blur ${card.color}`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                {card.label}
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {stats[card.id] ?? 0}
              </p>
              <p className="mt-2 text-xs text-white/70">
                Dibandingkan bulan lalu, data ini terus diperbarui oleh sistem.
              </p>
            </div>
          ))}
        </div>
      </PanelLayout>

      <PanelLayout
        title="Booking Terbaru"
        subtitle="Ringkasan aktivitas booking terbaru dengan status pembayaran di ujung jari."
        accent="Booking"
      >
        <div className="space-y-4">
          {recentBookings.length ? (
            recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200/60 bg-white/70 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Booking #{booking.id}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    Jamaah #{booking.jamaahId} - Paket #{booking.packageId}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                    {booking.status}
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500">
              Belum ada booking terbaru.
            </p>
          )}
        </div>
      </PanelLayout>
    </div>
  );
};

export default Dashboard;
