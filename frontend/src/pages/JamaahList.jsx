import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data Jamaah</h2>
        <Link
          to="/jamaahs/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm font-semibold"
        >
          Tambah Jamaah
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr>
              {["ID", "Nama", "Passport", "Paket", "Status", "Aksi"].map(
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
                  Memuat data jamaah...
                </td>
              </tr>
            ) : jamaahs.length ? (
              jamaahs.map((jamaah) => (
                <tr key={jamaah.id} className="text-sm">
                  <td className="px-5 py-4 border-b border-gray-200">{jamaah.id}</td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    {jamaah.fullName}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    {jamaah.passportNumber || "-"}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    {jamaah.packageId || "-"}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                      {jamaah.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm space-x-3">
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
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Tidak ada jamaah
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JamaahList;
