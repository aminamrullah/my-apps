import React from "react";

const Features = () => {
  const featuresList = [
    {
      title: "Super Cepat",
      desc: "Dibangun dengan teknologi terbaru untuk performa maksimal.",
      icon: "🚀",
    },
    {
      title: "Responsif",
      desc: "Tampilan sempurna di desktop, tablet, maupun mobile.",
      icon: "📱",
    },
    {
      title: "Aman",
      desc: "Keamanan tingkat tinggi untuk melindungi data pengguna Anda.",
      icon: "🔐",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Kami menyediakan fitur terbaik untuk membantu bisnis Anda berkembang
            pesat di era digital.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
