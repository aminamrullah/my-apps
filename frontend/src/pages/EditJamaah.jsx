import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../lib/api";
import PanelLayout from "../components/PanelLayout";

const statusOptions = ["Aktif", "Proses Visa", "Selesai", "Batal"];

const EditJamaah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    birthDate: "",
    passportNumber: "",
    nationality: "Indonesia",
    email: "",
    phone: "",
    packageId: "",
    status: "Aktif",
    notes: "",
  });
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
      const [jamaahRes, pkgRes] = await Promise.all([
        axios.get(`${API_BASE}/jamaahs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/packages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const jamaah = jamaahRes.data?.data || jamaahRes.data;
      setForm({
        fullName: jamaah.fullName || "",
        birthDate: jamaah.birthDate || "",
        passportNumber: jamaah.passportNumber || "",
        nationality: jamaah.nationality || "Indonesia",
        email: jamaah.email || "",
        phone: jamaah.phone || "",
        packageId: jamaah.packageId ? String(jamaah.packageId) : "",
        status: jamaah.status || "Aktif",
        notes: jamaah.notes || "",
      });
      setPackages(pkgRes.data?.data || []);
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
    } else {
      setError("Tidak bisa memuat data jamaah.");
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
        `${API_BASE}/jamaahs/${id}`,
        {
          fullName: form.fullName.trim(),
          birthDate: form.birthDate || null,
          passportNumber: form.passportNumber.trim() || null,
          nationality: form.nationality.trim() || "Indonesia",
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          packageId: form.packageId ? Number(form.packageId) : null,
          status: form.status,
          notes: form.notes.trim() || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate("/jamaahs");
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

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100";

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-600">Memuat data jamaah...</div>
    );
  }

  return (
    <div className="p-6">
      <PanelLayout
        title="Edit Jamaah"
        subtitle="Perbarui informasi jamaah beserta paket dan status keberangkatan."
        accent="Jamaah"
        action={
          <Link
            to="/jamaahs"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Kembali ke daftar
          </Link>
        }
      >
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              value={form.fullName}
              onChange={updateField("fullName")}
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={updateField("birthDate")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Passport
              </label>
              <input
                value={form.passportNumber}
                onChange={updateField("passportNumber")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nationality
              </label>
              <input
                value={form.nationality}
                onChange={updateField("nationality")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nomor HP
              </label>
              <input
                value={form.phone}
                onChange={updateField("phone")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Paket Umrah
              </label>
              <select
                value={form.packageId}
                onChange={updateField("packageId")}
                className={inputClass}
              >
                <option value="">Pilih paket (opsional)</option>
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
                Status
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
            <div />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Catatan
            </label>
            <textarea
              value={form.notes}
              onChange={updateField("notes")}
              className={inputClass}
              rows={3}
            />
          </div>
          {error && (
            <p className="text-sm font-semibold text-rose-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </PanelLayout>
    </div>
  );
};

export default EditJamaah;
