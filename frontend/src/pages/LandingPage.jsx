import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import { API_BASE } from "../lib/api";

const systemHighlights = [
  {
    title: "Data Jamaah Lengkap",
    description:
      "Rekam data identitas, paspor, grup perjalanan, dan status visa dalam satu layar.",
    points: ["Riwayat paket", "Status vaksinasi", "Catatan visa & paspor"],
  },
  {
    title: "Paket Umrah Terstruktur",
    description:
      "Kelola paket berdasarkan durasi, harga, dan jadwal keberangkatan dengan mudah.",
    points: [
      "Pengaturan kapasitas",
      "Detail fasilitas akomodasi",
      "Harga & keberangkatan",
    ],
  },
  {
    title: "Booking & Keuangan",
    description:
      "Pantau paket terbooking, status pembayaran, dan seat assignment dari satu dashboard.",
    points: [
      "Status booking real-time",
      "Pembayaran & deposit",
      "Nomor kursi & catatan",
    ],
  },
  {
    title: "Tim Operasional",
    description:
      "Kelompokkan pegawai (tour leader, guide, admin, marketing, dll) sesuai tanggung jawab.",
    points: ["Distribusi role", "Kontak & catatan", "Penugasan trip"],
  },
];

const LandingPage = () => {
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packageError, setPackageError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const response = await axios.get(`${API_BASE}/public/packages`);
        if (!isActive) return;
        setPackages(response.data?.data || []);
        setPackageError("");
      } catch (error) {
        if (isActive) {
          setPackageError("Tidak dapat memuat paket terbaru dari database.");
        }
      } finally {
        if (isActive) {
          setLoadingPackages(false);
        }
      }
    };

    fetchPackages();
    return () => {
      isActive = false;
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <section id="cta" className="py-12 px-4">
          <div className="max-w-6xl mx-auto grid gap-6">
            <div className="rounded-3xl bg-white shadow-2xl p-8">
              <h3 className="text-3xl font-semibold text-gray-900">MyUmrah</h3>
              <p className="text-gray-600 mt-3">
                Sistem manajemen umrah terintegrasi untuk agen perjalanan yang
                ingin mengelola data jamaah, paket umrah, booking, dan tim
                operasional dalam satu platform mudah digunakan.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {systemHighlights.map((item) => (
                <div
                  key={item.title}
                  className="h-full rounded-3xl bg-white p-6 shadow-lg flex flex-col"
                >
                  <h4 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 mt-2 flex-1">
                    {item.description}
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-blue-600">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="packages"
          className="py-12 px-4 bg-gradient-to-b from-white to-blue-50"
        >
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">
                Paket Umrah Unggulan
              </p>
              <h3 className="text-3xl font-semibold text-gray-900">
                Tawarkan pengalaman ibadah yang terencana
              </h3>
              <p className="text-gray-600 mt-2 max-w-3xl">
                jelajahi paket umrah unggulan kami
              </p>
              {packageError && (
                <p className="text-sm text-red-600 mt-2">{packageError}</p>
              )}
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {loadingPackages ? (
                <div className="md:col-span-3 rounded-3xl bg-white p-6 shadow-xl text-center text-gray-500">
                  Memuat paket unggulan...
                </div>
              ) : packages.length ? (
                packages.map((pkg) => {
                  const durationText =
                    pkg.duration ||
                    (pkg.durationDays
                      ? `${pkg.durationDays} Hari`
                      : "Durasi fleksibel");
                  const priceText =
                    typeof pkg.price === "number"
                      ? `Rp ${pkg.price.toLocaleString("id-ID")}`
                      : pkg.price || "-";
                  return (
                    <div
                      key={pkg.id ?? pkg.title}
                      className="rounded-3xl bg-white p-6 shadow-xl flex flex-col"
                    >
                      <div className="text-sm text-blue-500 font-semibold uppercase tracking-wide">
                        Paket Umrah
                      </div>
                      <h4 className="text-2xl font-semibold text-gray-900 mt-2">
                        {pkg.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {durationText}
                      </p>
                      <p className="text-3xl font-bold text-blue-600 mt-4">
                        {priceText}
                      </p>
                      {pkg.departureDate && (
                        <p className="text-xs text-gray-400 mt-1">
                          Keberangkatan {pkg.departureDate}
                        </p>
                      )}
                      <p className="mt-4 text-gray-600 flex-1">
                        {pkg.description}
                      </p>
                      <button className="mt-6 rounded-full border border-blue-600 text-blue-600 font-semibold px-4 py-2 hover:bg-blue-50 transition">
                        Pelajari Paket
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="md:col-span-3 rounded-3xl bg-white p-6 shadow-xl text-center text-gray-600">
                  Belum ada paket umrah yang dipublikasikan.
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900">
              Masuk untuk mengatur jamaah dan paket umrah Anda
            </h3>
            <p className="text-gray-600 mt-3">
              Mulai dari landing page hingga detail booking, panel admin yang
              sudah Anda kenal sekarang dapat skala untuk seluruh operasional
              umrah; termasuk manajemen pegawai seperti tour leader, guide,
              admin, marketing, dan staff lainnya.
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
        <section id="contact" className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-blue-50 p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-blue-600">
                Hubungi Kami
              </h4>
              <p className="text-gray-600 mt-2 text-sm">
                Konsultasi kebutuhan sistem umrah, request demo, atau dukungan
                teknis bisa langsung menghubungi tim operasional.
              </p>
            </div>
            <div className="rounded-3xl bg-white border border-blue-50 p-6 shadow-lg">
              <p className="text-sm font-semibold text-gray-500">
                Email Support
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                support@umrahinfo.id
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Balasan cepat di jam kerja 08.00 - 18.00 WIB.
              </p>
            </div>
            <div className="rounded-3xl bg-white border border-blue-50 p-6 shadow-lg">
              <p className="text-sm font-semibold text-gray-500">Telepon</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                +62 812 3456 7890
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Tersedia WA dan hotline operasional.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
