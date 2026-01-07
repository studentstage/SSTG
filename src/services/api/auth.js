import apiClient from '../apiClient';
import { debugAPIResponse } from '../../utils/debugAPI';

export const authService = {
  // Login user
  async login(email, password) {
    console.log('🔐 Login attempt with:', { email });
    const response = await apiClient.post('/login', {
      email,
      password,
    });
    
    // Debug the response
    debugAPIResponse('LOGIN', response.data);
    
    return response.data;
  },

  // Register user
  async register(userData) {
    console.log('📝 Register attempt with:', { 
      username: userData.username, 
      email: userData.email 
    });
    
    const response = await apiClient.post('/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirmPassword,
    });
    
    // Debug the response
    debugAPIResponse('REGISTER', response.data);
    
    return response.data;
  },

  // Logout user
  async logout() {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }
  },

  // Get current user profile (THIS IS WHERE ROLE SHOULD BE)
  async getCurrentUser() {
    console.log('👤 Fetching current user from /me endpoint...');
    const response = await apiClient.get('/me');
    
    // Debug the response
    debugAPIResponse('ME', response.data);
    
    return response.data;
  },

  // Get user profile by ID
  async getUserProfile(userId) {
    console.log(`👤 Fetching profile for user ${userId}...`);
    const response = await apiClient.get(`/profiles/${userId}`);
    
    // Debug the response
    debugAPIResponse(`PROFILE/${userId}`, response.data);
    
    return response.data;
  },

  // Get current user's full data (user + profile)
  async getFullUserData() {
    try {
      // First get basic user info
      const userResponse = await apiClient.get('/me');
      const userData = userResponse.data;
      
      console.log('👤 Full user data fetch:', userData);
      
      // If /me returns profile with role, we're done
      if (userData.role || userData.profile?.role) {
        return userData;
      }
      
      // Otherwise, try to get profile by user ID
      if (userData.id) {
        const profileResponse = await apiClient.get(`/profiles/${userData.id}`);
        return {
          ...userData,
          profile: profileResponse.data
        };
      }
      
      return userData;
    } catch (error) {
      console.error('Error fetching full user data:', error);
      throw error;
    }
  }
};
