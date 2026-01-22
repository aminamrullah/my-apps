import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
// PENTING: Gunakan ini untuk redirect
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
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

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Nama</th>
              <th className="py-3 px-6 text-left">Email</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left font-medium">{user.name}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Dashboard;
