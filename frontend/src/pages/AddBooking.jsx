import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

const statusOptions = ["Pending", "Proses", "Selesai", "Dibatalkan"];
const paymentOptions = ["Menunggu", "Lunas", "Deposit"];

const AddBooking = () => {
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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadReferences(token);
  }, [navigate]);

  const loadReferences = async (token) => {
    try {
      setFetching(true);
      const [jamaahRes, packageRes] = await Promise.all([
        axios.get(`${API_BASE}/jamaahs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/packages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setJamaahs(jamaahRes.data?.data || []);
      setPackages(packageRes.data?.data || []);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setFetching(false);
    }
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setError("Tidak dapat memuat referensi data.");
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
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/bookings`,
        {
          jamaahId: Number(form.jamaahId),
          packageId: Number(form.packageId),
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
      setError(err.response?.data?.message || "Gagal menyimpan booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tambah Booking</h2>
      </div>
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
                disabled={fetching}
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
                disabled={fetching}
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
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBooking;
