import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../lib/api";

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

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Memuat data jamaah...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Jamaah</h2>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              value={form.fullName}
              onChange={updateField("fullName")}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nomor HP
              </label>
              <input
                value={form.phone}
                onChange={updateField("phone")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Paket Umrah
              </label>
              <select
                value={form.packageId}
                onChange={updateField("packageId")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
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
            <div />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Catatan
            </label>
            <textarea
              value={form.notes}
              onChange={updateField("notes")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              rows={3}
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

export default EditJamaah;
