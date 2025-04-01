import api from "../utils/api";

const authService = {
  // Register a new user
  register: async (name, email, password) => {
    const response = await api.post("/user/register", {
      name,
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      api.setAuthToken(response.data.token);
    }
    return response.data.user;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post("/user/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      api.setAuthToken(response.data.token);
    }
    return response.data.user;
  },

  // Logout user
  logout: async () => {
    localStorage.removeItem("token");
    api.removeAuthToken();
    return true;
  },

  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    api.setAuthToken(token);
    const response = await api.get("/user/profile");
    if (!response.data) {
      throw new Error("Failed to fetch user data");
    }
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/user/profile", userData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/user/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
