import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
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
    fetchEmployees(storedToken);
  };

  const fetchEmployees = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data?.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Hapus pegawai ini?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${API_BASE}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees(token);
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
        <h2 className="text-2xl font-bold text-gray-800">Pegawai Operasional</h2>
        <Link
          to="/employees/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm font-semibold"
        >
          Tambah Pegawai
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr>
              {["ID", "Nama", "Role", "Email", "Kontak", "Aksi"].map((title) => (
                <th
                  key={title}
                  className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Memuat data pegawai...
                </td>
              </tr>
            ) : employees.length ? (
              employees.map((employee) => (
                <tr key={employee.id} className="text-sm">
                  <td className="px-5 py-4 border-b border-gray-200">{employee.id}</td>
                  <td className="px-5 py-4 border-b border-gray-200">{employee.name}</td>
                  <td className="px-5 py-4 border-b border-gray-200">{employee.role}</td>
                  <td className="px-5 py-4 border-b border-gray-200">{employee.email}</td>
                  <td className="px-5 py-4 border-b border-gray-200">{employee.phone || "-"}</td>
                  <td className="px-5 py-4 border-b border-gray-200 space-x-3">
                    <Link
                      to={`/employees/edit/${employee.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteEmployee(employee.id)}
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
                  Tidak ada pegawai
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
