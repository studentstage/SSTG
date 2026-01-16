const TOKEN_KEY = "access_token";
const USER_KEY = "user_data";

export const tokenService = {
  // Store token and user data
  setAuthData(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get user data
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  // Get user role
  getUserRole() {
    const user = this.getUser();
    if (!user) return null;

    const role =
      user.role ||
      user.profile?.role ||
      user.user?.profile?.role ||
      user.user?.role;

    return role ? role.toUpperCase() : null;
  },

  // Get username
  getUsername() {
    const user = this.getUser();
    if (!user) return "User";
    return user.username || user.user?.username || "User";
  },

  // Clear auth data (logout)
  clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken();
  },
};
