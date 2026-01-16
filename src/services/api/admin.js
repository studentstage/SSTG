import apiClient from "../apiClient";

export const adminService = {
  async getProfiles() {
    const response = await apiClient.get("/profiles");
    return response.data;
  },

  async addUserToGroup(userId, group) {
    const endpoint = `/addtogroup/${group}/${userId}`;
    const response = await apiClient.post(endpoint);
    return response.data;
  },
};
