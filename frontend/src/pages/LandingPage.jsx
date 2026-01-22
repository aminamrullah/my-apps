import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Navbar from "../components/Navbars";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">WebService</div>
          <nav className="flex items-center gap-4 text-sm sm:text-base text-gray-600">
            <a href="#home" className="hover:text-blue-600">
              Beranda
            </a>
            <a href="#features" className="hover:text-blue-600">
              Fitur
            </a>
            <Link to="/login" className="hover:text-blue-600">
              Masuk
            </Link>
            <Link to="/register" className="hover:text-blue-600">
              Daftar
            </Link>
          </nav>
        </div>
      </header> */}
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900">
              Kelola pengguna dan izin dengan mudah
            </h3>
            <p className="text-gray-600 mt-3">
              Mulai dari landing page hingga panel admin, semua dalam satu alur
              yang konsisten. Masuk untuk melihat data real-time dan menambah
              tim.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Masuk ke Dashboard
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
              >
                Daftar Pengguna Baru
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
