import React from "react";

const PackageList = () => {
  return (
    <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-4">
      <h2 className="text-3xl font-semibold text-gray-900">Paket Umrah</h2>
      <p className="text-gray-600">
        Halaman ini akan menampilkan paket umrah lengkap dengan jadwal,
        durasi, harga, serta kuota. Anda bisa mengelompokkan paket berdasarkan
        tipe keberangkatan dan memperbarui status seat secara real-time.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((item) => (
          <article
            key={item}
            className="p-4 border border-gray-100 rounded-2xl shadow-sm"
          >
            <h3 className="font-semibold text-blue-600">
              Contoh Paket #{item}
            </h3>
            <p className="text-sm text-gray-500">Durasi 10 hari / 7 malam</p>
            <p className="text-gray-700 mt-2">
              Deskripsi singkat tentang fasilitas hotel bintang 5, transportasi, dan
              program manasik.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PackageList;
