import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Password dan Confirm Password tidak cocok");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
        confPassword: confirmPassword,
        gender,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-xl px-8 py-10 space-y-5"
      >
        <h2 className="text-center text-3xl font-semibold text-gray-800">
          Register
        </h2>
        {error && (
          <p className="text-sm text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Nama lengkap"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@contoh.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Minimal 8 karakter"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Ulangi password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>
        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link className="text-blue-600 hover:underline" to="/login">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
