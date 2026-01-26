import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import PanelLayout from "../components/PanelLayout";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
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
    fetchPackages(storedToken);
  };

  const fetchPackages = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data?.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id) => {
    if (!window.confirm("Hapus paket ini?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${API_BASE}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPackages(token);
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
        title="Paket Umrah"
        subtitle="Atur paket perjalanan, jadwal keberangkatan, dan kuota jamaah."
        accent="Paket"
        action={
          <Link
            to="/packages/add"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Tambah Paket
          </Link>
        }
      >
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
              <tr>
                {[
                  "ID",
                  "Judul",
                  "Harga",
                  "Keberangkatan",
                  "Kapasitas",
                  "Aksi",
                ].map((title) => (
                  <th key={title} className="px-4 py-3 text-left font-semibold">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Memuat paket...
                  </td>
                </tr>
              ) : packages.length ? (
                packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {pkg.id}
                    </td>
                    <td className="px-4 py-4">{pkg.title}</td>
                    <td className="px-4 py-4">
                      Rp {pkg.price?.toLocaleString("id-ID") || "-"}
                    </td>
                    <td className="px-4 py-4">
                      {pkg.departureDate || "-"}
                    </td>
                    <td className="px-4 py-4">{pkg.capacity}</td>
                    <td className="px-4 py-4 space-x-3 text-xs font-semibold uppercase tracking-[0.2em]">
                      <Link
                        to={`/packages/edit/${pkg.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePackage(pkg.id)}
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
                    Tidak ada paket
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

export default PackageList;
