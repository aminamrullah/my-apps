import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    note: "",
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
        `${API_BASE}/employees`,
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
      setError(err.response?.data?.message || "Gagal menyimpan pegawai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Tambah Pegawai Operasional
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama
            </label>
            <input
              value={form.name}
              onChange={updateField("name")}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Peran
            </label>
            <input
              value={form.role}
              onChange={updateField("role")}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              placeholder="Tour leader, marketing, dll"
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
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kontak (opsional)
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
              Catatan
            </label>
            <textarea
              value={form.note}
              onChange={updateField("note")}
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
            {loading ? "Menyimpan..." : "Simpan Pegawai"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
