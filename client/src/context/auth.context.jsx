import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios.config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const restoreSession = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  restoreSession();
}, [token]);

  const login = async (credentials) => {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};