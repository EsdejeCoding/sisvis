import React from "react";
import { Link } from "react-router-dom";

export default function NavHead(prop) {
  return (
    <>
      <header className="bg-white shadow p-4 rounded-2xl mb-6 flex justify-between">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          <Link to="/">SISVIS - Sistem Informasi Servis</Link>
        </h1>
        <nav className="flex items-center gap-6 text-gray-600 font-medium">
          <Link
            to="/"
            className={`${
              prop.active === "home" ? "text-blue-600 " : ""
            }hover:text-blue-400`}
          >
            Antrian
          </Link>
          <Link
            to="/harga"
            className={`${
              prop.active === "harga" ? "text-blue-600 " : ""
            }hover:text-blue-400`}
          >
            Harga
          </Link>
          <Link
            to="/akun"
            className={`${
              prop.active === "akun" ? "text-blue-600 " : ""
            }hover:text-blue-400`}
          >
            Akun
          </Link>
        </nav>
      </header>
    </>
  );
}
