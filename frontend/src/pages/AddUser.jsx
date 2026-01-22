import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (password !== confPassword) {
      setError("Password dan Confirm Password harus sama");
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/api/users",
        { name, email, password, gender },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate("/users");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(error.response?.data?.message || "Terjadi kesalahan saat menyimpan");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Tambah User Baru
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <form onSubmit={saveUser}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nama
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan Nama Lengkap"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              placeholder="Ulangi Password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Gender
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddUser;
