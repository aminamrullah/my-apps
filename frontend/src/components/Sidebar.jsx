import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <ul className="p-4 space-y-2">
        <li>
          <Link
            to="/dashboard"
            className="block p-3 rounded hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/users"
            className="block p-3 rounded hover:bg-gray-700 transition"
          >
            Manajemen User
          </Link>
        </li>
        {/* <li>
          <Link
            to="/users/add"
            className="block p-3 rounded hover:bg-gray-700 transition"
          >
            Tambah User
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
