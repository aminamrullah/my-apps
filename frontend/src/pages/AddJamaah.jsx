import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tambah Jamaah</h2>
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
              placeholder="Nama jamaah"
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
                placeholder="Nomor passport"
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
                placeholder="0812..."
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
              placeholder="Catatan tambahan"
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
            {loading ? "Menyimpan..." : "Simpan Jamaah"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJamaah;
