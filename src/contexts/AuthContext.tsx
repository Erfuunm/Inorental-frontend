import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./ApiProvider"; // Adjust the import path
import toast from "react-hot-toast";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("isAuthenticated")
  );
  const navigate = useNavigate();
  const api = useApi();
  const user = false;

  const login = async (email: string, password: string) => {
    try {
      debugger;
      const response = await api.upost("/api/login/", { email, password });
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("accessToken", response.body.access);
        toast.success("Wellcome!!");
        window.location.reload();
        navigate("/"); // Adjust the redirect path as needed
      } else {
        throw new Error(response.body.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      debugger;
      const response = await api.upost("/api/register/", {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      if (response.ok) {
        await login(email, password); // Auto-login after successful signup
      } else {
        if (response.body.email) {
          throw new Error(response.body.email[0]);
        }
        if (response.body.username) {
          throw new Error(response.body.username);
        }
        throw new Error(response.body.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged Out!!");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
