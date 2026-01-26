import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredUser, removeStoredUser } from "../lib/session";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/jamaahs", label: "Data Jamaah", icon: "🧭" },
  { to: "/packages", label: "Paket Umrah", icon: "🛫" },
  { to: "/bookings", label: "Paket Terbooking", icon: "🎟️" },
  { to: "/employees", label: "Pegawai Operasional", icon: "🧑" },
  { to: "/users", label: "Manajemen User", icon: "👥" },
];

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const overlayClasses =
    "fixed inset-0 z-40 bg-slate-900/70 transition-opacity duration-200 md:hidden";
  const navClasses =
    "fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-slate-950 text-white shadow-2xl transition-transform duration-200 ease-in-out md:relative md:block md:translate-x-0 flex flex-col ";
  const storedUser = getStoredUser();
  const profileName = storedUser?.name?.trim();
  const friendlyName = profileName ? profileName.split(" ")[0] : "Admin";
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    removeStoredUser();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`${overlayClasses} ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
        onClick={onClose}
      />
      <aside
        className={`${navClasses} ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Sidebar menu"
      >
        <div className="px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/60">
            MyUmrah
          </p>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Admin Panel
          </h1>
          {/* <p className="mt-2 text-sm text-white/60">
            Mode profesional untuk monitoring jamaah, paket, dan booking.
          </p> */}
        </div>

        <div className="flex gap-3 px-4">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="h-10 w-10 rounded-2xl bg-white/20 text-center text-base leading-10">
              🤍
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Halo, {friendlyName}
              </p>
              <p className="text-xs text-white/60">
                Siap mendampingi operasi setiap hari.
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs tracking-[0.4em]">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-4 py-6">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-full border border-white/30 bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-lg transition hover:from-sky-400 hover:to-cyan-300"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
