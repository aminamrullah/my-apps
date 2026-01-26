import React from "react";
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/jamaahs", label: "Data Jamaah", icon: "🕋" },
  { to: "/packages", label: "Paket Umrah", icon: "🗂️" },
  { to: "/bookings", label: "Paket Terbooking", icon: "📝" },
  { to: "/employees", label: "Pegawai Operasional", icon: "👥" },
  { to: "/users", label: "Manajemen User", icon: "🧑" },
];

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const overlayClasses =
    "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden";
  const navClasses =
    "fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-gray-800 text-white transition-transform duration-200 ease-in-out md:relative md:block md:translate-x-0 flex flex-col";
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div
        className={`${overlayClasses} ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
        onClick={onClose}
      />
      <aside
        className={`${navClasses} ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Sidebar menu"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 md:border-none">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white"
            aria-label="Tutup menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded hover:bg-gray-700 transition"
              >
                <span aria-hidden="true" className="text-lg">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4 py-6 border-t border-gray-700">
          <button
            type="button"
            onClick={logout}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
