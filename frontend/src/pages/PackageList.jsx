import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Paket Umrah</h2>
        <Link
          to="/packages/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm font-semibold"
        >
          Tambah Paket
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr>
              {["ID", "Judul", "Harga", "Keberangkatan", "Kapasitas", "Aksi"].map(
                (title) => (
                  <th
                    key={title}
                    className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Memuat paket...
                </td>
              </tr>
            ) : packages.length ? (
              packages.map((pkg) => (
                <tr key={pkg.id} className="text-sm">
                  <td className="px-5 py-4 border-b border-gray-200">{pkg.id}</td>
                  <td className="px-5 py-4 border-b border-gray-200">{pkg.title}</td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    Rp {pkg.price?.toLocaleString("id-ID") || "-"}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    {pkg.departureDate || "-"}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">{pkg.capacity}</td>
                  <td className="px-5 py-4 border-b border-gray-200 space-x-3">
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
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Tidak ada paket
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageList;
