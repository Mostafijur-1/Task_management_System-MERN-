import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../../services/authService";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    const message =
      err.response?.data?.message || err.message || "Authentication failed";
    setError(message);
    throw new Error(message);
  };

  // Load user from localStorage or API
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        // Check localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Verify with the server
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        localStorage.removeItem("user");
        setUser(null);
        console.error("Error fetching user:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await authService.login(email, password);

      // Update user state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      setError(null);
      return userData;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const userData = await authService.register(name, email, password);

      // Update user state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      setError(null);
      return userData;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user, // Fix: Ensure correct authentication state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
