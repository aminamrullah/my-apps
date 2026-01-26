import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import { storeUserSession } from "../lib/session";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: email,
        password: password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      storeUserSession(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data?.message || "Gagal login, coba lagi");
      }
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-700 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-950 via-white-900 to-white-950 px-4 py-10">
      <div className="mx-auto max-w-lg space-y-6 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-white/60">
            Portal Admin
          </p>
          <h1 className="text-4xl font-bold text-white">Login</h1>
          <p className="text-sm text-white/70">
            Masuk untuk mengelola jamaah, paket, booking, dan pegawai.
          </p>
        </div>
        <form onSubmit={Auth} className="space-y-4">
          {msg && <p className="text-center text-sm text-rose-400">{msg}</p>}
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Masukkan password"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:opacity-90"
          >
            Masuk
          </button>
        </form>
        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/70">
          Belum punya akun?{" "}
          <Link to="/register" className="text-white/90 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
