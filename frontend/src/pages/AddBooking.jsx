import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import PanelLayout from "../components/PanelLayout";

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

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100";

  return (
    <div className="p-6">
      <PanelLayout
        title="Tambah Booking"
        subtitle="Catat booking jamaah beserta status pembayaran dan nomor seat."
        accent="Booking"
        action={
          <Link
            to="/bookings"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Kembali ke daftar
          </Link>
        }
      >
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Jamaah
              </label>
              <select
                value={form.jamaahId}
                onChange={updateField("jamaahId")}
                required
                className={inputClass}
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
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Paket
              </label>
              <select
                value={form.packageId}
                onChange={updateField("packageId")}
                required
                className={inputClass}
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tanggal Booking
              </label>
              <input
                type="date"
                value={form.bookingDate}
                onChange={updateField("bookingDate")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Seat Number
              </label>
              <input
                value={form.seatNumber}
                onChange={updateField("seatNumber")}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status Booking
              </label>
              <select
                value={form.status}
                onChange={updateField("status")}
                className={inputClass}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status Pembayaran
              </label>
              <select
                value={form.paymentStatus}
                onChange={updateField("paymentStatus")}
                className={inputClass}
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
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Catatan
            </label>
            <textarea
              value={form.notes}
              onChange={updateField("notes")}
              rows={3}
              className={inputClass}
            />
          </div>
          {error && (
            <p className="text-sm font-semibold text-rose-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Booking"}
          </button>
        </form>
      </PanelLayout>
    </div>
  );
};

export default AddBooking;
