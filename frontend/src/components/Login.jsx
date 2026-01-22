import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const Auth = async (e) => {
    e.preventDefault();
    try {
      // 1. Kirim email & password ke Backend
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: email,
        password: password,
      });
      // 2. Ambil token dari respon backend
      const token = response.data.token;
      // 3. Simpan token ke LocalStorage Browser
      localStorage.setItem("token", token);
      // 4. Redirect ke Dashboard
      navigate("/dashboard");
    } catch (error) {
      // Jika password salah / user tidak ada
      if (error.response) {
        setMsg(error.response.data?.message || "Gagal login, coba lagi");
      }
    }
  };
  return (
    // <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
    <div className="w-full max-w-xs">
      <form
        onSubmit={Auth}
        className="bg-white shadow-lg rounded-xl px-8 py-10 space-y-8"
      >
        <h2 className="text-center text-3xl font-semibold text-gray-800">
          Login
        </h2>
        {msg && <p className="text-center text-red-500 text-sm">{msg}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="******************"
          />
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition">
          Masuk
        </button>
        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
    // </div>
  );
};
export default Login;
