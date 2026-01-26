import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import PanelLayout from "../components/PanelLayout";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadEmployee(token);
  }, [id, navigate]);

  const loadEmployee = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const employee = response.data?.data || response.data;
      setForm({
        name: employee.name || "",
        role: employee.role || "",
        email: employee.email || "",
        phone: employee.phone || "",
        note: employee.note || "",
      });
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
        `${API_BASE}/employees/${id}`,
        {
          name: form.name.trim(),
          role: form.role.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          note: form.note.trim() || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate("/employees");
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
      <div className="p-6 text-center text-slate-600">Memuat data pegawai...</div>
    );
  }

  return (
    <div className="p-6">
      <PanelLayout
        title="Edit Pegawai Operasional"
        subtitle="Perbarui informasi pegawai sesuai tugasnya."
        accent="Pegawai"
        action={
          <Link
            to="/employees"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Kembali ke daftar
          </Link>
        }
      >
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Nama
            </label>
            <input
              value={form.name}
              onChange={updateField("name")}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Peran
            </label>
            <input
              value={form.role}
              onChange={updateField("role")}
              required
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
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Kontak (opsional)
            </label>
            <input
              value={form.phone}
              onChange={updateField("phone")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Catatan
            </label>
            <textarea
              value={form.note}
              onChange={updateField("note")}
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

export default EditEmployee;
