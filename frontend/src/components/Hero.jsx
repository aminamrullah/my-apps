import React from "react";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section
      id="home"
      className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white"
    >
      {" "}
      <div className="container mx-auto px-4 text-center">
        {" "}
        {/* Headline */}{" "}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {" "}
          Bangun Website Impian <br />{" "}
          <span className="text-blue-600">Lebih Cepat & Elegan</span>{" "}
        </h1>{" "}
        {/* Subheadline */}{" "}
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {" "}
          Framework terbaik untuk developer yang ingin fokus pada fungsionalitas
          tanpa pusing memikirkan CSS dasar. Mulai sekarang juga.{" "}
        </p>{" "}
        {/* CTA Buttons */}{" "}
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Mulai Sekarang
          </Link>
          <a
            href="#features"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border border-blue-200 hover:bg-blue-50 transition"
          >
            Pelajari Dulu
          </a>
        </div>
        {/* Image Placeholder */}{" "}
        <div className="mt-16">
          {" "}
          {/* Kita gunakan div sebagai placeholder gambar dashboard */}{" "}
          <div className="mx-auto bg-gray-200 rounded-xl shadow-2xl w-full max-w-4xl h-64 md:h-96 flex items-center justify-center text-gray-400">
            {" "}
            [Image Dashboard Placeholder]{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default Hero;
