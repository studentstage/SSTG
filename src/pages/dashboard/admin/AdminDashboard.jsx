import React, { useState, useEffect } from 'react';
import { Users, Shield, BarChart3, Settings, Plus, AlertTriangle, User } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, userRole, username, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    console.log('Admin Dashboard - User data:', {
      user,
      userRole,
      username,
      localStorageUser: JSON.parse(localStorage.getItem('user_data'))
    });
    
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
      console.log('Admin extracted details:', details);
    }
  }, [user, userRole, username]);

  const stats = [
    { icon: <Users size={24} />, label: 'Total Users', value: '0', color: 'blue' },
    { icon: <Shield size={24} />, label: 'Admins', value: '0', color: 'purple' },
    { icon: <Users size={24} />, label: 'Tutors', value: '0', color: 'green' },
    { icon: <AlertTriangle size={24} />, label: 'Pending Approvals', value: '0', color: 'yellow' },
  ];

  const quickActions = [
    { icon: <Users size={20} />, label: 'User Management', color: 'bg-blue-500 dark:bg-blue-600' },
    { icon: <AlertTriangle size={20} />, label: 'Pending Approvals', color: 'bg-yellow-500 dark:bg-yellow-600' },
    { icon: <Plus size={20} />, label: 'Add News', color: 'bg-green-500 dark:bg-green-600' },
    { icon: <Settings size={20} />, label: 'System Settings', color: 'bg-gray-500 dark:bg-gray-600' },
  ];

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

      {/* Debug Info Panel */}
      <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Admin Debug Info</h3>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
              <p>User Role: <code>{userRole || 'Not set'}</code></p>
              <p>Username: <code>{username || 'Not set'}</code></p>
              <p>User ID: <code>{userDetails?.id || 'Not set'}</code></p>
              <p>Profile ID: <code>{userDetails?.profileId || 'Not set'}</code></p>
            </div>
          </div>
          <button
            onClick={() => {
              console.log('Admin - Full user object:', user);
              console.log('Admin - LocalStorage:', localStorage.getItem('user_data'));
              toast.success('Admin data logged to console');
            }}
            className="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Log to Console
          </button>
        </div>
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="card p-4 text-center hover:shadow-md transition-shadow duration-200 dark:hover:shadow-gray-800"
              onClick={() => toast.success(`Admin action: ${action.label}`)}
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <div className="text-white">
                  {action.icon}
                </div>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Admin Controls */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage users, content, and platform settings
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">User Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all users</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Content Moderation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve content</p>
              </div>
            </div>
          </button>
        </div>
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
