import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../lib/api";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API_BASE}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const user = response.data?.data || response.data;
      setName(user.name);
      setEmail(user.email);
      setGender(user.gender || "Laki-laki");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser(token);
  }, [id, navigate]);

  const submitUpdate = async (event) => {
    event.preventDefault();
    setError("");
    if (newPassword && newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError("Password dan Confirm Password tidak cocok");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const payload = { name, email, gender };
    if (newPassword) {
      payload.password = newPassword;
    }
    try {
      await axios.put(`${API_BASE}/users/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/users");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
        <form className="space-y-4" onSubmit={submitUpdate}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Baru (opsional)
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Biarkan kosong jika tidak berubah"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Ulangi password baru"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
