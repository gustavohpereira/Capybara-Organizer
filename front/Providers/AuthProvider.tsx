"use client";
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useUser } from "./UserProvider";

// Definindo o tipo para o contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  auth: () => Promise<Function>;
  logout: () => void;
  login: ({ email, password }: { email: string; password: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setUser } = useUser();

  const user  = useUser();

  // Função de login
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      if (response.status === 200 && response.data.token) {
        // veja se o token é valido
        const userData = await fetchUser(response.data.token);
        if (userData == null) {
          logout();
          return null;
        }
        console.log("Login bem-sucedido", response.data.token);
        Cookies.set("token", response.data.token);
        setIsAuthenticated(true);
        (console.log("setando o user", userData));

        setUser(userData);
        window.location.href = "/home"
        return response.data;
      }
    } catch (error) {
      console.error("Falha no login", error);
    }
  };

  // Função de autenticação
  const auth = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = "/";
      return null;
    }

    try {
      const userData = await fetchUser(token);
      if (userData == null) {
        logout();
        return null;
      } else {
        setIsAuthenticated(true);
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error("Autenticação falhou", error);
      setIsAuthenticated(false);
    }
  };

  // Função de logout
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };



  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return null
      }
    } catch (error) {
      console.error("Autenticação falhou", error);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, auth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );




};

// Hook para usar o AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};


