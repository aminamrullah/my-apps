import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-xl font-semibold text-gray-800"></div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {/* <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
          <span className="hover:text-gray-900 cursor-pointer">Users</span>
          <span className="hover:text-gray-900 cursor-pointer">Reports</span> */}
        </div>
        <button
          onClick={logout}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
