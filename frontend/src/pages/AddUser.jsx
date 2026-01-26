import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import PanelLayout from "../components/PanelLayout";

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
        `${API_BASE}/users`,
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

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100";

  return (
    <div className="p-6">
      <PanelLayout
        title="Tambah User Baru"
        subtitle="Buat akun admin untuk mengelola seluruh modul sistem."
        accent="Users"
        action={
          <Link
            to="/users"
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Kembali ke daftar
          </Link>
        }
      >
        <form onSubmit={saveUser} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nama
              </label>
              <input
                type="text"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Email
              </label>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Password
              </label>
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Konfirmasi Password
              </label>
              <input
                type="password"
                className={inputClass}
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Ulangi password"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Gender
            </label>
            <select
              className={inputClass}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          {error && (
            <p className="text-sm font-semibold text-rose-600" role="alert">
              {error}
            </p>
          )}
          <button
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-slate-800"
            type="submit"
          >
            Simpan User
          </button>
        </form>
      </PanelLayout>
    </div>
  );
};
export default AddUser;
