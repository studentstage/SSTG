import axios from 'axios';

const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  "https://student-stage-backend-apis.onrender.com/api";
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const API_BASE_URL = normalizedBaseUrl.endsWith("/api")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      window.dispatchEvent(new Event("auth:logout"));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
