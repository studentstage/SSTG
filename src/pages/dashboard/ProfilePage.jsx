import React, { useEffect, useState } from "react";
import { Camera, Mail, MapPin, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../../services/api/auth";
import { profileService } from "../../services/api/profile";
import { useAuth } from "../../contexts/AuthContext";

const ProfilePage = () => {
  const { user: authUser, userRole, refreshUserData } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    sector: "",
    marked_as: "",
  });

  const buildProfileData = (data) => {
    const base = data || {};
    const nestedUser = base.user || {};

    return {
      id: base.id || nestedUser.id || "N/A",
      username: nestedUser.username || base.username || "User",
      email: nestedUser.email || base.email || "—",
      fullName:
        base.full_name && base.full_name.trim() ? base.full_name : "Not provided",
      role: (base.role || userRole || "STUDENT").toString().toUpperCase(),
      dateJoined: base.date_joined,
      image: base.image || null,
      address: base.address || "—",
      sector: base.sector || "—",
      markedAs: base.marked_as || "—",
    };
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getCurrentUser();
      const mapped = buildProfileData(data);
      setProfile(mapped);
      setFormData({
        full_name: data?.full_name || "",
        address: data?.address || "",
        sector: data?.sector || "",
        marked_as: data?.marked_as || "",
      });
      setImageFile(null);
    } catch (err) {
      toast.error("Failed to load profile.");
      if (authUser) {
        const mapped = buildProfileData(authUser);
        setProfile(mapped);
        setFormData({
          full_name: authUser?.full_name || "",
          address: authUser?.address || "",
          sector: authUser?.sector || "",
          marked_as: authUser?.marked_as || "",
        });
        setImageFile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile?.id) {
      toast.error("Missing profile id.");
      return;
    }

    setSaving(true);
    try {
      const payloadBase = {
        full_name: formData.full_name,
        address: formData.address,
        sector: formData.sector,
        marked_as: formData.marked_as,
      };

      let payload = payloadBase;
      if (imageFile) {
        const formPayload = new FormData();
        Object.entries(payloadBase).forEach(([key, value]) => {
          formPayload.append(key, value ?? "");
        });
        formPayload.append("image", imageFile);
        payload = formPayload;
      }

      const updated = await profileService.updateProfile(profile.id, payload);
      const mapped = buildProfileData(updated);
      setProfile(mapped);
      setFormData({
        full_name: updated?.full_name || "",
        address: updated?.address || "",
        sector: updated?.sector || "",
        marked_as: updated?.marked_as || "",
      });
      setImageFile(null);
      setEditing(false);
      if (refreshUserData) {
        refreshUserData();
      }
      toast.success("Profile updated.");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile && loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">No profile data available.</p>
      </div>
    );
  }

  const initials = (() => {
    const nameSource =
      profile.fullName && profile.fullName !== "Not provided"
        ? profile.fullName
        : profile.username || "U";
    return nameSource
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your account details and role.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    full_name: profile.fullName === "Not provided" ? "" : profile.fullName,
                    address: profile.address === "—" ? "" : profile.address,
                    sector: profile.sector === "—" ? "" : profile.sector,
                    marked_as: profile.markedAs === "—" ? "" : profile.markedAs,
                  });
                  setImageFile(null);
                }}
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                disabled={saving}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Edit Profile
              </button>
              <button
                onClick={loadProfile}
                className="inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span>{loading ? "Refreshing..." : "Refresh"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {resolveImageUrl(profile.image) ? (
                <img
                  src={resolveImageUrl(profile.image)}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-semibold text-blue-600 dark:text-blue-300">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <Camera size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              {profile.fullName !== "Not provided" ? profile.fullName : profile.username}
            </h2>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {profile.role.toLowerCase()}
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <Mail size={14} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin size={14} />
                <span>{profile.address}</span>
              </div>
            </div>
            {editing && (
              <div className="mt-6 w-full space-y-3 text-left">
                <label className="block text-xs text-gray-500 dark:text-gray-400">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setImageFile(file);
                  }}
                  className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.username}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.role.toLowerCase()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.id}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.dateJoined
                  ? new Date(profile.dateJoined).toLocaleDateString()
                  : "—"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
              {editing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.fullName}
                </p>
              )}
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
              {editing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.address}
                </p>
              )}
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Sector</p>
              {editing ? (
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.sector}
                </p>
              )}
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Marked As</p>
              {editing ? (
                <input
                  type="text"
                  name="marked_as"
                  value={formData.marked_as}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.markedAs}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
  const resolveImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    const apiBase =
      import.meta.env.VITE_API_URL ||
      "https://student-stage-backend-apis.onrender.com/api";
    const origin = apiBase.replace(/\/api\/?$/, "");
    if (image.startsWith("/")) return `${origin}${image}`;
    return `${origin}/${image}`;
  };
