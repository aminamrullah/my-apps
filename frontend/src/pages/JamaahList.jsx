import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import PanelLayout from "../components/PanelLayout";

const JamaahList = () => {
  const [jamaahs, setJamaahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }
    fetchJamaahs(storedToken);
  };

  const fetchJamaahs = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/jamaahs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJamaahs(response.data?.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJamaah = async (id) => {
    const confirmDelete = window.confirm("Hapus data jamaah?");
    if (!confirmDelete) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${API_BASE}/jamaahs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJamaahs(token);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="p-6">
      <PanelLayout
        title="Data Jamaah"
        subtitle="Kelola profil jamaah, paket yang diambil, serta status keberangkatan."
        accent="Jamaah"
        action={
          <Link
            to="/jamaahs/add"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Tambah Jamaah
          </Link>
        }
      >
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
              <tr>
                {["ID", "Nama", "Passport", "Paket", "Status", "Aksi"].map(
                  (title) => (
                    <th key={title} className="px-4 py-3 text-left font-semibold">
                      {title}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Memuat data jamaah...
                  </td>
                </tr>
              ) : jamaahs.length ? (
                jamaahs.map((jamaah) => (
                  <tr key={jamaah.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {jamaah.id}
                    </td>
                    <td className="px-4 py-4">{jamaah.fullName}</td>
                    <td className="px-4 py-4">
                      {jamaah.passportNumber || "-"}
                    </td>
                    <td className="px-4 py-4">
                      {jamaah.packageId || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {jamaah.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 space-x-3 text-xs font-semibold uppercase tracking-[0.2em]">
                      <Link
                        to={`/jamaahs/edit/${jamaah.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteJamaah(jamaah.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Tidak ada jamaah
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelLayout>
    </div>
  );
};

export default JamaahList;
