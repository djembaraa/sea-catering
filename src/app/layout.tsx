import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "@/context/AuthContext"; // 1. PASTIKAN INI DI-IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEA Catering",
  description: "Healthy Meals, Anytime, Anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* 2. PASTIKAN INI MEMBUNGKUS NAVBAR DAN CHILDREN */}
          <Navbar />
          <main>{children}</main>{" "}
          {/* Disarankan membungkus children dengan <main> */}
        </AuthProvider>
      </body>
    </html>
  );
}
