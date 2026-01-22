import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
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
      {" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <h2 className="text-2xl font-bold text-gray-800">Daftar User</h2>{" "}
        <Link
          to="/users/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm font-semibold"
        >
          {" "}
          Tambah Baru{" "}
        </Link>{" "}
      </div>{" "}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {" "}
        <table className="min-w-full leading-normal">
          {" "}
          <thead>
            {" "}
            <tr>
              {" "}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {" "}
                ID{" "}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {" "}
                Nama{" "}
              </th>{" "}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {" "}
                Email{" "}
              </th>{" "}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {" "}
                Aksi{" "}
              </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {users.map((user, index) => (
              <tr key={user.id}>
                {" "}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {" "}
                  {index + 1}{" "}
                </td>{" "}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {" "}
                  <p className="text-gray-900 whitespace-no-wrap font-medium">
                    {user.name}
                  </p>{" "}
                </td>{" "}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {" "}
                  <p className="text-gray-900 whitespace-no-wrap">
                    {user.email}
                  </p>{" "}
                </td>{" "}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-2">
                  {" "}
                  <Link
                    to={`/users/edit/${user.id}`}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    {" "}
                    Edit{" "}
                  </Link>{" "}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    {" "}
                    Hapus{" "}
                  </button>{" "}
                </td>{" "}
              </tr>
            ))}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
};
export default UserList;
