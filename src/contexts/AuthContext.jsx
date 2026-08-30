import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { authService } from "../services/api/auth";
import { tokenService } from "../services/tokenService";

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

  const isDemoToken = (token) => {
    return token && (token.startsWith("demo-") || token.includes("demo-session") || token === "student-stage-demo-token");
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = tokenService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // If this is a demo/offline session, do not make backend network requests
      if (isDemoToken(token)) {
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

  const loginAsDemo = (role = "STUDENT") => {
    const normalizedRole = role.toUpperCase();
    const demoUser = {
      id: `demo-${normalizedRole.toLowerCase()}-01`,
      username: `Demo${normalizedRole.charAt(0)}${normalizedRole.slice(1).toLowerCase()}`,
      email: `${normalizedRole.toLowerCase()}@studentstage.demo`,
      role: normalizedRole,
      profile: {
        id: 999,
        full_name: `Demo ${normalizedRole.charAt(0)}${normalizedRole.slice(1).toLowerCase()}`,
        role: normalizedRole,
        sector: "Computer Science",
        address: "Faculty of Computing & Mathematical Sciences",
        date_joined: new Date().toISOString(),
      },
    };

    const demoToken = `student-stage-demo-token`;
    tokenService.setAuthData(demoToken, demoUser);
    setUser(demoUser);
    setError(null);
    return { success: true, user: demoUser };
  };

  useEffect(() => {
    const syncUserFromStorage = () => {
      setUser(tokenService.getUser());
    };

    const handleAuthLogout = () => {
      syncUserFromStorage();
      setError(null);
    };

    window.addEventListener("storage", syncUserFromStorage);
    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("storage", syncUserFromStorage);
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
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
    if (!user) return null;

    const role =
      user.role || user.profile?.role || user.user?.profile?.role || user.user?.role;

    return role ? role.toUpperCase() : null;
  }, [user]);

  // Get username - memoized to update when user changes
  const username = useMemo(() => {
    if (!user) return "User";
    return user.username || user.user?.username || "User";
  }, [user]);

  // Check if authenticated - based on token existence
  const isAuthenticated = useMemo(() => {
    return tokenService.isAuthenticated();
  }, [user]);

  const isDemoSession = useMemo(() => {
    const token = tokenService.getToken();
    return isDemoToken(token);
  }, [user]);

  const value = {
    user,
    login,
    loginAsDemo,
    isDemoSession,
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
