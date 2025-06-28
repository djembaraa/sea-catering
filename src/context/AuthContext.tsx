"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Definisikan tipe untuk data user yang kita simpan dari token
interface UserPayload {
  id: string;
  role: string;
}

// Definisikan tipe untuk nilai yang disediakan oleh context
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserPayload | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: string; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // useEffect ini berjalan setiap kali URL berubah, untuk memastikan status login selalu sinkron
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // "Decode" token untuk mendapatkan data user (id dan role)
        const decodedToken: { user: UserPayload } = jwtDecode(token);
        setUser(decodedToken.user); // Simpan data user ke state
      } else {
        setUser(null);
      }
    } catch (error) {
      // Jika token tidak valid (misalnya format salah), hapus token dan set user ke null
      console.error("Invalid token:", error);
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [pathname]);

  // Fungsi untuk menangani proses login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(
        "https://sea-catering-api.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");

      localStorage.setItem("token", data.token);
      const decodedToken: { user: UserPayload } = jwtDecode(data.token);
      setUser(decodedToken.user); // Langsung update state user setelah login berhasil

      return { success: true, role: data.role };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  // Fungsi untuk menangani proses logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); // Hapus data user dari state saat logout
    router.push("/login");
  };

  // Sediakan state dan fungsi ke seluruh aplikasi
  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
