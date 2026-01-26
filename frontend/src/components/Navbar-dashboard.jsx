import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuToggle = () => {} }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
          <button
            onClick={onMenuToggle}
            className="md:hidden rounded-full border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 transition"
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
          <div className="text-xl font-semibold text-gray-800">
            {/* Panel Admin MyUmrah */}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {/* Future top navigation */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
