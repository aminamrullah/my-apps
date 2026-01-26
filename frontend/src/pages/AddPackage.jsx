import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import PanelLayout from "../components/PanelLayout";

const AddPackage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationDays: 9,
    price: "",
    departureDate: "",
    capacity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        `${API_BASE}/packages`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          durationDays: Number(form.durationDays),
          price: Number(form.price || 0),
          departureDate: form.departureDate || null,
          capacity: Number(form.capacity),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate("/packages");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "Gagal menyimpan paket");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100";

  return (
    <div className="p-6">
      <PanelLayout
        title="Tambah Paket"
        subtitle="Detail paket akan digunakan jamaah saat melakukan booking."
        accent="Paket"
        action={
          <Link
            to="/packages"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Kembali ke daftar
          </Link>
        }
      >
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Judul Paket
            </label>
            <input
              value={form.title}
              onChange={updateField("title")}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={updateField("description")}
              required
              rows={4}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Durasi (hari)
              </label>
              <input
                type="number"
                value={form.durationDays}
                onChange={updateField("durationDays")}
                min={1}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Harga (Rp)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={updateField("price")}
                min={0}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tanggal Keberangkatan
              </label>
              <input
                type="date"
                value={form.departureDate}
                onChange={updateField("departureDate")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Kapasitas
              </label>
              <input
                type="number"
                value={form.capacity}
                onChange={updateField("capacity")}
                min={0}
                className={inputClass}
              />
            </div>
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
            {loading ? "Menyimpan..." : "Simpan Paket"}
          </button>
        </form>
      </PanelLayout>
    </div>
  );
};

export default AddPackage;
