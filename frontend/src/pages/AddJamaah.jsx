import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import PanelLayout from "../components/PanelLayout";

const statusOptions = ["Aktif", "Proses Visa", "Selesai", "Batal"];

const AddJamaah = () => {
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
  const [loading, setLoading] = useState(false);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadPackages(token);
  }, [navigate]);

  const loadPackages = async (token) => {
    try {
      setFetchingPackages(true);
      const response = await axios.get(`${API_BASE}/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data?.data || []);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setFetchingPackages(false);
    }
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setError("Tidak dapat memuat data paket.");
    }
  };

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
        `${API_BASE}/jamaahs`,
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
      setError(err.response?.data?.message || "Gagal menyimpan jamaah.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100";

  return (
    <div className="p-6">
      <PanelLayout
        title="Tambah Jamaah"
        subtitle="Masukkan data jamaah yang akan berangkat umrah berserta paketnya."
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
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Nama Lengkap
            </label>
            <input
              value={form.fullName}
              onChange={updateField("fullName")}
              required
              className={inputClass}
              placeholder="Nama jamaah"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={updateField("birthDate")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Passport
              </label>
              <input
                value={form.passportNumber}
                onChange={updateField("passportNumber")}
                className={inputClass}
                placeholder="Nomor passport"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nationality
              </label>
              <input
                value={form.nationality}
                onChange={updateField("nationality")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                className={inputClass}
                placeholder="nama@domain.com"
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
                placeholder="0812..."
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
                disabled={fetchingPackages}
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
              placeholder="Catatan tambahan"
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
            {loading ? "Menyimpan..." : "Simpan Jamaah"}
          </button>
        </form>
      </PanelLayout>
    </div>
  );
};

export default AddJamaah;
