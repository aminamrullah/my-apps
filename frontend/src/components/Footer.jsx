import React from "react";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      {" "}
      <div className="container mx-auto px-4 text-center">
        {" "}
        <h2 className="text-2xl font-bold mb-4">MyBrand</h2>{" "}
        <p className="text-gray-400 mb-6">
          {" "}
          (c) 2024 MyBrand Inc. All rights reserved.{" "}
        </p>{" "}
        <div className="flex justify-center gap-6">
          {" "}
          <a href="#" className="hover:text-blue-400 transition">
            Twitter
          </a>{" "}
          <a href="#" className="hover:text-blue-400 transition">
            LinkedIn
          </a>{" "}
          <a href="#" className="hover:text-blue-400 transition">
            Instagram
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
};
export default Footer;
