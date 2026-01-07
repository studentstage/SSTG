import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api/auth';
import { debugLocalStorage } from '../utils/debugAPI';

// Simple token service
const tokenService = {
  setAuthData(token, user) {
    console.log('💾 Storing auth data:', { 
      hasToken: !!token, 
      user: user 
    });
    
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    
    // Debug what we stored
    debugLocalStorage();
  },
  
  getToken() {
    return localStorage.getItem('access_token');
  },
  
  getUser() {
    const userStr = localStorage.getItem('user_data');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user_data:', e);
      return null;
    }
  },
  
  // Get role from stored user data
  getUserRole() {
    const user = this.getUser();
    if (!user) {
      console.log('❌ No user data found');
      return null;
    }
    
    console.log('🔍 Searching for role in:', user);
    
    // Check all possible role locations based on your API structure
    const role = user.role ||                     // Direct on user object
                 user.profile?.role ||            // In profile object
                 user.user?.profile?.role;        // Deep nested
    
    if (role) {
      console.log('✅ Found role:', role);
      return role.toUpperCase(); // Ensure uppercase (ADMIN, TUTOR, STUDENT)
    }
    
    console.log('❌ No role found in user object');
    return null;
  },
  
  getUsername() {
    const user = this.getUser();
    if (!user) return 'User';
    
    return user.username || user.user?.username || 'User';
  },
  
  clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    console.log('🧹 Cleared auth data');
  },
  
  isAuthenticated() {
    return !!this.getToken();
  }
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tokenService.getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complete user data (with role) after login
  const fetchCompleteUserData = async () => {
    try {
      console.log('🔄 Fetching complete user data...');
      
      // Try to get full user data with profile
      const fullUserData = await authService.getFullUserData();
      console.log('✅ Complete user data:', fullUserData);
      
      // Update localStorage with complete data
      const token = tokenService.getToken();
      if (token) {
        tokenService.setAuthData(token, fullUserData);
      }
      
      // Update state
      setUser(fullUserData);
      
      return fullUserData;
    } catch (err) {
      console.error('❌ Failed to fetch complete user data:', err);
      // If we can't get full data, at least keep what we have
      return tokenService.getUser();
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = tokenService.getToken();
      
      if (!token) {
        console.log('❌ No token found, skipping validation');
        setLoading(false);
        return;
      }

      try {
        console.log('🔐 Validating session with token...');
        // Fetch fresh complete user data
        await fetchCompleteUserData();
      } catch (err) {
        console.error('❌ Session validation failed:', err);
        tokenService.clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('🚀 Starting login process...');
      
      // Step 1: Login to get token
      const loginResponse = await authService.login(email, password);
      const { 'Access Token': accessToken, user: basicUserData } = loginResponse;
      
      console.log('✅ Login successful, basic data:', basicUserData);
      
      if (!accessToken) {
        throw new Error('No access token in response');
      }
      
      // Step 2: Store basic data immediately
      tokenService.setAuthData(accessToken, basicUserData);
      setUser(basicUserData);
      
      // Step 3: Try to fetch complete user data in background
      setTimeout(async () => {
        try {
          const completeData = await fetchCompleteUserData();
          console.log('✅ Background fetch complete:', completeData);
        } catch (err) {
          console.warn('⚠️ Background fetch failed, using basic data:', err);
        }
      }, 100);
      
      return { success: true, user: basicUserData };
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message ||
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('🚀 Starting registration process...');
      
      const response = await authService.register(userData);
      const { 'Access Token': accessToken, user: userResponse } = response;
      
      console.log('✅ Registration successful:', userResponse);
      
      if (!accessToken) {
        throw new Error('No access token in response');
      }
      
      // Store in localStorage
      tokenService.setAuthData(accessToken, userResponse);
      
      // Update state
      setUser(userResponse);
      
      // Try to fetch complete data in background
      setTimeout(async () => {
        try {
          await fetchCompleteUserData();
        } catch (err) {
          console.warn('Background fetch failed after registration:', err);
        }
      }, 100);
      
      return { success: true, user: userResponse };
    } catch (err) {
      console.error('❌ Registration error:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data) {
        const errors = err.response.data;
        
        if (typeof errors === 'object') {
          const firstErrorKey = Object.keys(errors)[0];
          const firstError = errors[firstErrorKey];
          
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        } else if (typeof errors === 'string') {
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

  // Get user role
  const getUserRole = () => {
    return tokenService.getUserRole();
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError: () => setError(null),
    isAuthenticated: tokenService.isAuthenticated(),
    userRole: getUserRole(),
    username: tokenService.getUsername(),
    refreshUserData: fetchCompleteUserData, // Allow manual refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
