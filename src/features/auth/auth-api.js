import { apiClient } from "../../services/api/client";

export const authApi = {
  login: (email, password, config) =>
    apiClient
      .post("/login", { email, password }, config)
      .then(({ data }) => data),
  register: (userData, config) =>
    apiClient
      .post(
        "/register",
        {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          confirm_password: userData.confirmPassword,
        },
        config,
      )
      .then(({ data }) => data),
  logout: (config) =>
    apiClient.post("/logout", undefined, config).then(({ data }) => data),
  getCurrentUser: (config) =>
    apiClient.get("/me", config).then(({ data }) => data),
  getProfile: (userId, config) =>
    apiClient.get(`/profiles/${userId}`, config).then(({ data }) => data),
};
