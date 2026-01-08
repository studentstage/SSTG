import apiClient from "../apiClient";

export const authService = {
  // Login user
  async login(email, password) {
    const response = await apiClient.post("/login", {
      email,
      password,
    });
    return response.data;
  },

  // Register user
  async register(userData) {
    const response = await apiClient.post("/register", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirmPassword,
    });
    return response.data;
  },

  // Logout user
  async logout() {
    try {
      await apiClient.post("/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
    }
  },

  // Get current user profile
  async getCurrentUser() {
    const response = await apiClient.get("/me");
    return response.data;
  },

  // Get user profile by ID
  async getUserProfile(userId) {
    const response = await apiClient.get(`/profiles/${userId}`);
    return response.data;
  },

  // Get current user's full data (user + profile)
  async getFullUserData() {
    try {
      // First get basic user info
      const userResponse = await apiClient.get("/me");
      const userData = userResponse.data;

      // If /me returns profile with role, we're done
      if (userData.role || userData.profile?.role) {
        return userData;
      }

      // Otherwise, try to get profile by user ID
      if (userData.id) {
        const profileResponse = await apiClient.get(`/profiles/${userData.id}`);
        return {
          ...userData,
          profile: profileResponse.data,
        };
      }

      return userData;
    } catch (error) {
      throw error;
    }
  },
};
