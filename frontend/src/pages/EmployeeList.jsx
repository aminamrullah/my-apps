import React from "react";

const EmployeeList = () => {
  return (
    <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900">
        Pegawai Operasional
      </h2>
      <p className="text-gray-600">
        Hilangkan silo data pegawai; di satu tempat Anda bisa meninjau tour leader,
        tour guide, muthawif, admin, marketing, dan staff support. Hubungkan role
        dengan trip dan lihat kontak untuk setiap penugasan.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {["Tour Leader", "Marketing"].map((role) => (
          <article
            key={role}
            className="p-4 border border-gray-100 rounded-2xl shadow-sm"
          >
            <h3 className="font-semibold text-gray-900">{role}</h3>
            <p className="text-sm text-gray-500">Kontak & jadwal tugas</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EmployeeList;
