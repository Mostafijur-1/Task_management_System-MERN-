// Real implementation example with axios
import axios from "axios";

const API_URL = "http://localhost:3000/api/user";

const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(name, email, password) {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally call logout endpoint
    await axios.post(`${API_URL}/logout`);
  },

  async getCurrentUser() {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }

    // If you want to validate the token with the backend:
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

export default authService;
