import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import PanelLayout from "../components/PanelLayout";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // getUsers();
    refreshToken();
  }, []);

  const refreshToken = () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }
    setToken(storedToken);
    getUsers(storedToken);
  };

  const getUsers = async (tokenToUse) => {
    try {
      const response = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      setUsers(response.data?.data || []);
    } catch (error) {
      if (error.response) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus user ini?",
    );
    if (!confirmDelete) return;
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      getUsers(storedToken);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };
  return (
    <div className="p-6">
      <PanelLayout
        title="Manajemen User"
        subtitle="Kelola akun administrator dan pengguna lain yang dapat mengakses sistem."
        accent="Pengguna"
        action={
          <Link
            to="/users/add"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Tambah Baru
          </Link>
        }
      >
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
              <tr>
                {["ID", "Nama", "Email", "Aksi"].map((title) => (
                  <th key={title} className="px-4 py-3 text-left font-semibold">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {users.length ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-900">{user.name}</p>
                    </td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4 space-x-3 text-xs font-semibold uppercase tracking-[0.2em]">
                      <Link
                        to={`/users/edit/${user.id}`}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Belum ada user
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
export default UserList;
