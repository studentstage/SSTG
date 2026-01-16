import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Shield,
  AlertTriangle,
  User,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { adminService } from '../../../services/api/admin';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, userRole, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  useEffect(() => {
    if (user) {
      let details = {};
      
      if (user.user) {
        details = {
          id: user.id,
          username: user.user?.username || 'Admin',
          email: user.user?.email || '',
          role: user.role || 'ADMIN',
          profileId: user.id,
          fullName: user.full_name || '',
          dateJoined: user.date_joined || '',
        };
      } else if (user.profile) {
        details = {
          id: user.id,
          username: user.username || 'Admin',
          email: user.email || '',
          role: user.profile?.role || 'ADMIN',
          profileId: user.profile?.id,
          fullName: user.profile?.full_name || '',
          dateJoined: user.profile?.date_joined || '',
        };
      } else {
        details = {
          id: user.id || 'N/A',
          username: user.username || 'Admin',
          email: user.email || '',
          role: userRole || 'ADMIN',
          fullName: user.full_name || '',
        };
      }
      
      setUserDetails(details);
    }
  }, [user, userRole]);

  useEffect(() => {
    const loadProfiles = async () => {
      setLoadingStats(true);
      try {
        const data = await adminService.getProfiles();
        const list = Array.isArray(data) ? data : data?.results || [];
        setProfiles(list);
      } catch (err) {
        toast.error('Failed to load user statistics.');
      } finally {
        setLoadingStats(false);
      }
    };

    loadProfiles();
  }, []);

  const getProfileRole = (profile) => {
    const role =
      profile?.role ||
      profile?.profile?.role ||
      profile?.user?.role ||
      profile?.user?.profile?.role;
    return role ? role.toUpperCase() : 'STUDENT';
  };

  const stats = useMemo(() => {
    const counts = profiles.reduce(
      (acc, profile) => {
        const role = getProfileRole(profile);
        acc.total += 1;
        if (role === 'ADMIN') acc.admin += 1;
        if (role === 'TUTOR') acc.tutor += 1;
        return acc;
      },
      { total: 0, admin: 0, tutor: 0 }
    );

    const totalValue = loadingStats ? '...' : counts.total;
    const adminValue = loadingStats ? '...' : counts.admin;
    const tutorValue = loadingStats ? '...' : counts.tutor;

    return [
      { icon: <Users size={24} />, label: 'Total Users', value: totalValue, color: 'blue' },
      { icon: <Shield size={24} />, label: 'Admins', value: adminValue, color: 'purple' },
      { icon: <Users size={24} />, label: 'Tutors', value: tutorValue, color: 'green' },
      { icon: <AlertTriangle size={24} />, label: 'Pending Approvals', value: '0', color: 'yellow' },
    ];
  }, [profiles, loadingStats]);

  const colorClasses = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  };


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <User size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Role: <span className="font-medium capitalize">{userRole?.toLowerCase() || 'admin'}</span>
                </p>
                {userDetails?.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {userDetails.email}
                  </p>
                )}
              </div>
            </div>
            
            {userDetails?.dateJoined && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Joined: {new Date(userDetails.dateJoined).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            toast.success('Logged out successfully');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition dark:bg-red-700 dark:hover:bg-red-800"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 relative overflow-hidden">
            <div className={`absolute top-4 right-4 w-12 h-12 ${colorClasses[stat.color].bg} rounded-lg flex items-center justify-center`}>
              <div className={colorClasses[stat.color].text}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Role Information */}
      <div className="card p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Shield className="text-purple-600 dark:text-purple-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
            Administrator Account
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
            As an administrator, you have full access to manage users, moderate content, 
            configure system settings, and monitor platform activity.
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Full administrative privileges active</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>API Endpoint: https://student-stage-backend-apis.onrender.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
