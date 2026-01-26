import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import PanelLayout from "../components/PanelLayout";

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
      <PanelLayout
        title="Pegawai Operasional"
        subtitle="Daftar pegawai yang bertugas di setiap lini operasional umrah."
        accent="Pegawai"
        action={
          <Link
            to="/employees/add"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Tambah Pegawai
          </Link>
        }
      >
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
              <tr>
                {["ID", "Nama", "Role", "Email", "Kontak", "Aksi"].map(
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
                    Memuat data pegawai...
                  </td>
                </tr>
              ) : employees.length ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {employee.id}
                    </td>
                    <td className="px-4 py-4">{employee.name}</td>
                    <td className="px-4 py-4">{employee.role}</td>
                    <td className="px-4 py-4">{employee.email}</td>
                    <td className="px-4 py-4">{employee.phone || "-"}</td>
                    <td className="px-4 py-4 space-x-3 text-xs font-semibold uppercase tracking-[0.2em]">
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
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Tidak ada pegawai
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

export default EmployeeList;
