import React from "react";
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div
        className="container mx-auto px-4 py-3 flex justify-between
items-center"
      >
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          MyBrand
        </div>
        {/* Menu (Desktop) */}
        <div className="hidden md:flex space-x-8">
          <a
            href="#home"
            className="text-gray-600 hover:text-blue-600
transition"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600
transition"
          >
            Fitur
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-blue-600
transition"
          >
            Harga
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-blue-600
transition"
          >
            Kontak
          </a>
        </div>
        {/* Tombol Login */}
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-full
hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
