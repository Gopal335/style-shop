import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};