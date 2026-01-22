import React from "react";
import { Link } from "react-router-dom";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/jamaahs", label: "Data Jamaah", icon: "🕋" },
  { to: "/packages", label: "Paket Umrah", icon: "🗂️" },
  { to: "/bookings", label: "Paket Terbooking", icon: "📝" },
  { to: "/employees", label: "Pegawai Operasional", icon: "👥" },
  { to: "/users", label: "Manajemen User", icon: "🧑" },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <ul className="p-4 space-y-2">
        {menuItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
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
    </div>
  );
};

export default Sidebar;
