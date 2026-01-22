import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";

const statusOptions = ["Pending", "Proses", "Selesai", "Dibatalkan"];
const paymentOptions = ["Menunggu", "Deposit", "Lunas"];

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    jamaahId: "",
    packageId: "",
    bookingDate: "",
    status: "Pending",
    paymentStatus: "Menunggu",
    seatNumber: "",
    notes: "",
  });
  const [jamaahs, setJamaahs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadData(token);
  }, [id, navigate]);

  const loadData = async (token) => {
    try {
      setLoading(true);
      const [bookingRes, jamaahRes, packageRes] = await Promise.all([
        axios.get(`${API_BASE}/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/jamaahs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/packages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const booking = bookingRes.data?.data || bookingRes.data;
      setForm({
        jamaahId: booking.jamaahId ? String(booking.jamaahId) : "",
        packageId: booking.packageId ? String(booking.packageId) : "",
        bookingDate: booking.bookingDate || "",
        status: booking.status || "Pending",
        paymentStatus: booking.paymentStatus || "Menunggu",
        seatNumber: booking.seatNumber || "",
        notes: booking.notes || "",
      });
      setJamaahs(jamaahRes.data?.data || []);
      setPackages(packageRes.data?.data || []);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE}/bookings/${id}`,
        {
          jamaahId: form.jamaahId ? Number(form.jamaahId) : null,
          packageId: form.packageId ? Number(form.packageId) : null,
          bookingDate: form.bookingDate || null,
          status: form.status,
          paymentStatus: form.paymentStatus,
          seatNumber: form.seatNumber.trim() || null,
          notes: form.notes.trim() || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate("/bookings");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat booking...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Booking</h2>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Jamaah
              </label>
              <select
                value={form.jamaahId}
                onChange={updateField("jamaahId")}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              >
                <option value="">Pilih jamaah</option>
                {jamaahs.map((jamaah) => (
                  <option key={jamaah.id} value={jamaah.id}>
                    {jamaah.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Paket
              </label>
              <select
                value={form.packageId}
                onChange={updateField("packageId")}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              >
                <option value="">Pilih paket</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tanggal Booking
              </label>
              <input
                type="date"
                value={form.bookingDate}
                onChange={updateField("bookingDate")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Seat Number
              </label>
              <input
                value={form.seatNumber}
                onChange={updateField("seatNumber")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status Booking
              </label>
              <select
                value={form.status}
                onChange={updateField("status")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status Pembayaran
              </label>
              <select
                value={form.paymentStatus}
                onChange={updateField("paymentStatus")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              >
                {paymentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Catatan
            </label>
            <textarea
              value={form.notes}
              onChange={updateField("notes")}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBooking;
