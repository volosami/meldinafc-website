import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("meldina_admin_token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("meldina_admin_token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("meldina:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("meldina:unauthorized", handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.getAdminProfile();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login({ email, password: pass });
      if (res.success && res.data.token) {
        localStorage.setItem("meldina_admin_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
};
