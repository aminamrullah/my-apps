import React from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, removeStoredUser } from "../lib/session";

const NavbarDashboard = ({ onMenuToggle = () => {} }) => {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const logout = () => {
    localStorage.removeItem("token");
    removeStoredUser();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 shadow-lg text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
            aria-label="Buka menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              Admin Dashboard
            </p>
            <h1 className="text-xl font-semibold drop-shadow-sm">MyUmrah Panel</h1>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 text-sm sm:w-auto">
          <div className="flex flex-1 rounded-full bg-white/20 p-2 text-xs font-medium uppercase tracking-[0.3em] text-white/90 backdrop-blur">
            Halo, {storedUser?.name ?? "Administrator"}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/40 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
