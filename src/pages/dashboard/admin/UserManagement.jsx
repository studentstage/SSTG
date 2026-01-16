import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../../services/api/admin";

const UserManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [profilesError, setProfilesError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({});
  const [updatingIds, setUpdatingIds] = useState({});

  const getProfileRole = (profile) => {
    const role =
      profile?.role ||
      profile?.profile?.role ||
      profile?.user?.role ||
      profile?.user?.profile?.role;
    return role ? role.toUpperCase() : "STUDENT";
  };

  const getProfileUserId = (profile) => {
    return profile?.user?.id || profile?.user_id || profile?.id;
  };

  const loadProfiles = async () => {
    setLoadingProfiles(true);
    setProfilesError(null);
    try {
      const data = await adminService.getProfiles();
      const list = Array.isArray(data) ? data : data?.results || [];
      setProfiles(list);
    } catch (err) {
      setProfilesError("Failed to load user profiles.");
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return profiles;

    return profiles.filter((profile) => {
      const username =
        profile?.user?.username || profile?.username || profile?.full_name || "";
      const email = profile?.user?.email || profile?.email || "";
      return (
        username.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query)
      );
    });
  }, [profiles, searchQuery]);

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleAssignRole = async (profile) => {
    const userId = getProfileUserId(profile);
    if (!userId) {
      toast.error("Missing user id for this profile.");
      return;
    }

    const numericUserId = Number(userId);
    if (Number.isNaN(numericUserId)) {
      toast.error("User id must be a valid number.");
      return;
    }

    const role = selectedRoles[userId];
    if (!role) {
      toast.error("Select a role first.");
      return;
    }

    setUpdatingIds((prev) => ({ ...prev, [userId]: true }));
    try {
      await adminService.addUserToGroup(numericUserId, role.toLowerCase());
      toast.success(`Updated role to ${role}`);
      await loadProfiles();
    } catch (err) {
      toast.error("Failed to update role.");
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View profiles and assign roles.
          </p>
        </div>
        <button
          onClick={loadProfiles}
          className="inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          disabled={loadingProfiles}
        >
          <RefreshCw size={16} className={loadingProfiles ? "animate-spin" : ""} />
          <span>{loadingProfiles ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Users size={18} />
              <span>{filteredProfiles.length} users</span>
            </div>
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full md:max-w-sm px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6">
          {profilesError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
              {profilesError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Assign Role</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {loadingProfiles && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center">
                      Loading profiles...
                    </td>
                  </tr>
                )}

                {!loadingProfiles && filteredProfiles.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}

                {!loadingProfiles &&
                  filteredProfiles.map((profile) => {
                    const displayName =
                      profile?.user?.username ||
                      profile?.username ||
                      profile?.full_name ||
                      "User";
                    const email = profile?.user?.email || profile?.email || "—";
                    const role = getProfileRole(profile);
                    const userId = getProfileUserId(profile);
                    const rowKey = userId || profile?.id || displayName;
                    const selectedRole = selectedRoles[userId] || role;
                    const isUpdating = !!updatingIds[userId];

                    return (
                      <tr
                        key={rowKey}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-3 font-medium">{displayName}</td>
                        <td className="py-3">{email}</td>
                        <td className="py-3 capitalize">{role.toLowerCase()}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <select
                              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                              value={selectedRole}
                              onChange={(e) =>
                                handleRoleChange(userId, e.target.value)
                              }
                              disabled={isUpdating}
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="TUTOR">Tutor</option>
                              <option value="STUDENT">Student</option>
                            </select>
                            <button
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                              onClick={() => handleAssignRole(profile)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Saving..." : "Update"}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                            onClick={() =>
                              toast("Delete user not enabled yet.", {
                                icon: "🛠️",
                              })
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
