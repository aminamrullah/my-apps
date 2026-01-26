import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import PanelLayout from "../components/PanelLayout";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jamaahMap, setJamaahMap] = useState({});
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
    fetchData(storedToken);
  };

  const fetchData = async (token) => {
    try {
      setLoading(true);
      const [bookingRes, jamaahRes] = await Promise.all([
        axios.get(`${API_BASE}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/jamaahs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setBookings(bookingRes.data?.data || []);
      const map = {};
      (jamaahRes.data?.data || []).forEach((jamaah) => {
        map[jamaah.id] = jamaah.fullName;
      });
      setJamaahMap(map);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Hapus booking ini?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${API_BASE}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(token);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="p-6">
      <PanelLayout
        title="Paket Terbooking"
        subtitle="Rekap booking yang sudah dibuat jamaah, lengkap dengan status pembayaran."
        accent="Booking"
        action={
          <Link
            to="/bookings/add"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Tambah Booking
          </Link>
        }
      >
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
              <tr>
                {["ID", "Jamaah", "Paket", "Status", "Pembayaran", "Aksi"].map(
                  (title) => (
                    <th key={title} className="px-4 py-3 text-left font-semibold">
                      {title}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Memuat booking...
                  </td>
                </tr>
              ) : bookings.length ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {booking.id}
                    </td>
                    <td className="px-4 py-4">
                      {jamaahMap[booking.jamaahId] || `Jamaah #${booking.jamaahId}`}
                    </td>
                    <td className="px-4 py-4">{booking.packageId}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{booking.paymentStatus}</td>
                    <td className="px-4 py-4 space-x-3 text-xs font-semibold uppercase tracking-[0.2em]">
                      <Link
                        to={`/bookings/edit/${booking.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Tidak ada booking
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelLayout>
    </div>
  );
};

export default BookingList;
