import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          MyUmrah
        </div>
        {/* Menu (Desktop) */}
        <div className="hidden md:flex space-x-8">
          <a
            href="#home"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            About
          </a>
          <a
            href="#packages"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Package
          </a>
          <a
            href="#cta"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Fasilitas
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Kontak
          </a>
        </div>
        <div className="flex items-center gap-3">
          {/* <a
            href="#cta"
            className="hidden md:inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
          >
            Lihat CTA
          </a> */}
          {/* Tombol Login */}
          <Link to="/login">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
