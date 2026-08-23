import { createContext, useEffect, useState } from "react";
import { loginUser } from "../services/authService";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    const receivedToken =
      data.token || data.data?.token;

    const receivedUser =
      data.user || data.data?.user;

    if (!receivedToken) {
      throw new Error("Authentication token was not returned.");
    }

    localStorage.setItem("token", receivedToken);

    if (receivedUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(receivedUser)
      );
    }

    setToken(receivedToken);
    setUser(receivedUser || null);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;