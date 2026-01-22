import React from "react";

const JamaahList = () => {
  return (
    <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-4">Data Jamaah</h2>
      <p className="text-gray-600 mb-6">
        Semua data jamaah umrah tercatat di sini: identitas, passport,
        status keberangkatan, hingga paket yang sedang dikelola. Nantinya
        Anda dapat menambahkan filter untuk melihat jamaah berdasarkan
        pemantauan visa atau grup tour. Kolom-kolom ini siap dihubungkan ke
        API yang baru ditambahkan.
      </p>
      <div className="border border-dashed border-blue-200 rounded-2xl p-6 text-center text-blue-600">
        Dashboard jamaah akan ditampilkan di sini.
      </div>
    </section>
  );
};

export default JamaahList;
