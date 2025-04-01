import axios from "axios";

// Create axios instance with base URL from environment variable
// Falls back to localhost for development
const baseURL = "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle expired tokens or authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location = "/login";
    }

    // Handle server unavailable
    if (!error.response) {
      console.error("Server unavailable. Please try again later.");
    }

    return Promise.reject(error);
  }
);

// Helper methods for token management
const apiUtils = {
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  },

  removeAuthToken: () => {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  },

  // For testing connection
  pingServer: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Server health check failed", error);
      return { status: "error", message: "Could not connect to server" };
    }
  },
};

// Attach helper methods to the api object
Object.assign(api, apiUtils);

export default api;
