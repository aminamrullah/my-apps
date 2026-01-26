import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Paket Terbooking</h2>
        <Link
          to="/bookings/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm font-semibold"
        >
          Tambah Booking
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
          <thead>
            <tr>
              {["ID", "Jamaah", "Paket", "Status", "Pembayaran", "Aksi"].map(
                (title) => (
                  <th
                    key={title}
                    className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Memuat booking...
                </td>
              </tr>
            ) : bookings.length ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="text-sm">
                  <td className="px-5 py-4 border-b border-gray-200">{booking.id}</td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    {jamaahMap[booking.jamaahId] || `Jamaah #${booking.jamaahId}`}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    {booking.packageId}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    {booking.paymentStatus}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 space-x-3">
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
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Tidak ada booking
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
