import React from "react";

const BookingList = () => {
  return (
    <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900">Paket Terbooking</h2>
      <p className="text-gray-600">
        Pantau pemesanan jamaah di tiap paket: siapa yang sudah bayar, siapa yang
        menunggu konfirmasi, dan seat number-nya. Setiap booking otomatis
        terkait dengan paket dan jamaah sehingga koordinasi tim menjadi satu.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {["Booking 1", "Booking 2"].map((booking) => (
          <article
            key={booking}
            className="p-4 border border-gray-100 rounded-2xl shadow-sm"
          >
            <h3 className="font-semibold text-blue-600">{booking}</h3>
            <p className="text-sm text-gray-500">Status: Menunggu pembayaran</p>
            <p className="text-gray-700 mt-2">
              Jamaah nama X, paket promo Backpacker, seat A12.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BookingList;
