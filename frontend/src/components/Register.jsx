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
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat mendaftar.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-700 bg-white/10 px-4 py-3 text-sm text-slate placeholder:text-slate/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-950 via-white-900 to-white-950 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-slate/60">
            Bergabung Sekarang
          </p>
          <h1 className="text-4xl font-bold text-slate">Register</h1>
          <p className="text-sm text-slate/70">
            Buat akses administrator dan mulai kelola jamaah, paket, booking,
            dan pegawai.
          </p>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <p className="text-center text-sm text-rose-400" role="alert">
              {error}
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Nama Lengkap
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Nama lengkap"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate/70">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email@domain.com"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate/70">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Minimal 8 karakter"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate/70">
                Konfirmasi Password
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Ulangi password"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate/70">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={inputClass}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>
        <p className="text-center text-xs uppercase tracking-[0.3em] text-slate/70">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-slate/90 underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
