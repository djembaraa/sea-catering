"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // Ambil 'isAuthenticated' dan data 'user' (yang berisi role) dari context
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Subscription", href: "/subscription" },
  ];

  // Tentukan link dashboard secara dinamis berdasarkan role user
  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user";

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-cyan-400">
            SEA Catering
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`py-2 px-3 rounded transition duration-300 ${
                  pathname === link.href
                    ? "bg-cyan-500 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Tombol Login/Logout Dinamis untuk Desktop */}
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="py-2 px-3 rounded text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="py-2 px-3 rounded bg-red-500 text-white hover:bg-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="py-2 px-3 rounded bg-cyan-500 text-white hover:bg-cyan-600 font-semibold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Tombol Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden pb-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block py-2 px-4 text-sm ${
                pathname === link.href
                  ? "bg-cyan-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Tombol Login/Logout Dinamis untuk Mobile */}
          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left py-2 px-4 text-sm text-red-400 hover:bg-gray-700 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block py-2 px-4 text-sm text-cyan-400 hover:bg-gray-700 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
