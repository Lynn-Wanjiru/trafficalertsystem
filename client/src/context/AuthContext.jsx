import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Set Axios defaults to always include credentials
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      setUser(data.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log("login response:", data);
      await fetchUser(); // Refresh user state after login
      return { success: true };
    } catch (err) {
      console.error(
        "login error:",
        err.response?.status,
        err.response?.data?.message || err.message
      );
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/logout"
      );
      console.log("logout response:", data);
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error(
        "logout error:",
        err.response?.status,
        err.response?.data?.message || err.message
      );
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Logout failed",
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, fetching user...");
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
// This code provides an authentication context for the React application.
