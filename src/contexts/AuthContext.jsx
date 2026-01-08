import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { authService } from "../services/api/auth";

// Simple token service
const tokenService = {
  setAuthData(token, user) {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem("access_token");
  },

  getUser() {
    const userStr = localStorage.getItem("user_data");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  // Get role from stored user data
  getUserRole() {
    const user = this.getUser();
    if (!user) return null;

    // Check all possible role locations based on your API structure
    const role =
      user.role || // Direct on user object
      user.profile?.role || // In profile object
      user.user?.profile?.role; // Deep nested

    if (role) {
      return role.toUpperCase(); // Ensure uppercase (ADMIN, TUTOR, STUDENT)
    }
    return null;
  },

  getUsername() {
    const user = this.getUser();
    if (!user) return "User";
    return user.username || user.user?.username || "User";
  },

  clearAuthData() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tokenService.getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complete user data (with role) after login with retry logic
  const fetchCompleteUserData = async (retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Try to get full user data with profile
        const fullUserData = await authService.getFullUserData();

        // Update localStorage with complete data
        const token = tokenService.getToken();
        if (token) {
          tokenService.setAuthData(token, fullUserData);
        }

        // Update state
        setUser(fullUserData);
        return fullUserData;
      } catch (err) {
        // If this was the last retry, silently fail
        if (i === retries - 1) {
          console.warn("Could not fetch user role, using default");
          return tokenService.getUser();
        }
        // Wait a bit and retry
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = tokenService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchCompleteUserData();
      } catch (err) {
        // Silently handle session validation errors
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);

      // Step 1: Login to get token
      const loginResponse = await authService.login(email, password);

      // Handle both "Access Token" and "ACCESS TOKEN" formats
      const accessToken =
        loginResponse["Access Token"] || loginResponse["ACCESS TOKEN"];
      const basicUserData = loginResponse.user;

      if (!accessToken) {
        throw new Error("No access token in response");
      }

      // Step 2: Store basic data immediately
      tokenService.setAuthData(accessToken, basicUserData);
      setUser(basicUserData);

      // Step 3: Try to fetch complete user data in background with retry
      setTimeout(() => {
        fetchCompleteUserData(3).catch(() => {
          // Silently fail - user can still use app
        });
      }, 100);

      return { success: true, user: basicUserData };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);

      const response = await authService.register(userData);

      // Handle both "Access Token" and "ACCESS TOKEN" formats
      const accessToken = response["Access Token"] || response["ACCESS TOKEN"];
      const userResponse = response.user;

      if (!accessToken) {
        throw new Error("No access token in response");
      }

      // Store in localStorage
      tokenService.setAuthData(accessToken, userResponse);

      // Update state
      setUser(userResponse);

      // Try to fetch complete data in background with retry
      setTimeout(() => {
        fetchCompleteUserData(3).catch(() => {
          // Silently fail
        });
      }, 100);

      return { success: true, user: userResponse };
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.data) {
        const errors = err.response.data;

        if (typeof errors === "object") {
          const firstErrorKey = Object.keys(errors)[0];
          const firstError = errors[firstErrorKey];

          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === "string") {
            errorMessage = firstError;
          }
        } else if (typeof errors === "string") {
          errorMessage = errors;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      tokenService.clearAuthData();
      setUser(null);
      setError(null);
    }
  };

  // Get user role - memoized to update when user changes
  const userRole = useMemo(() => {
    return tokenService.getUserRole();
  }, [user]);

  // Get username - memoized to update when user changes
  const username = useMemo(() => {
    return tokenService.getUsername();
  }, [user]);

  // Check if authenticated - based on token existence
  const isAuthenticated = useMemo(() => {
    return tokenService.isAuthenticated();
  }, [user]);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError: () => setError(null),
    isAuthenticated,
    userRole,
    username,
    refreshUserData: fetchCompleteUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
