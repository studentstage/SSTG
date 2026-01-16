import apiClient from "../apiClient";

export const profileService = {
  async getProfile(profileId) {
    const response = await apiClient.get(`/profiles/${profileId}`);
    return response.data;
  },

  async updateProfile(profileId, payload) {
    const isFormData = payload instanceof FormData;
    const response = await apiClient.put(`/profiles/${profileId}`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
};
