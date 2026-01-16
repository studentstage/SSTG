import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, MessageSquare, BookOpen, Award, 
  TrendingUp, Users, Clock, Plus, User, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, userRole, username, refreshUserData } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      // Try to extract user details
      let details = {
        id: user.id || 'N/A',
        username: user.username || username || 'Student',
        email: user.email || '',
        role: userRole || 'STUDENT',
      };
      
      // Check for nested structures
      if (user.user) {
        details.username = user.user.username || details.username;
        details.email = user.user.email || details.email;
      }
      
      if (user.profile) {
        details.role = user.profile.role || details.role;
        details.fullName = user.profile.full_name;
        details.dateJoined = user.profile.date_joined;
      }
      
      setUserDetails(details);
    }
  }, [user, userRole, username]);

  const handleRefreshData = async () => {
    if (!refreshUserData) {
      toast.error('Refresh function not available');
      return;
    }
    
    setRefreshing(true);
    try {
      await refreshUserData();
      toast.success('User data refreshed!');
    } catch (error) {
      toast.error('Failed to refresh data');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const stats = [
    { icon: <HelpCircle size={24} />, label: 'Questions Asked', value: '0', color: 'blue', trend: '+2 this week' },
    { icon: <MessageSquare size={24} />, label: 'Answers Received', value: '0', color: 'green', progress: 0 },
    { icon: <Award size={24} />, label: 'Points Earned', value: '0', color: 'yellow', stars: 0 },
    { icon: <Users size={24} />, label: 'Active Tutors', value: '24', color: 'purple', status: '5 available now' },
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
            Welcome back, {userDetails?.username || 'Student'}! 👋
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <User size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Role: <span className="font-medium capitalize">{userRole?.toLowerCase() || 'student'}</span>
                </p>
                {userDetails?.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {userDetails.email}
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleRefreshData}
              disabled={refreshing}
              className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
              title="Refresh user data from API"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      {!userRole && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
              ⚠️
            </div>
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Role Not Detected</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Your user role could not be detected. This might be because:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                <li>The login API doesn't return role information</li>
                <li>We need to fetch your profile from the `/me` endpoint</li>
                <li>Click "Refresh Data" button to try fetching your profile</li>
              </ul>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                Check the debug panel (eye icon bottom-right) for details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
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
            
            {stat.trend && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                {stat.trend}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Role Information Card */}
      <div className="card p-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
            userRole === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30' :
            userRole === 'TUTOR' ? 'bg-green-100 dark:bg-green-900/30' :
            'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            <div className={
              userRole === 'ADMIN' ? 'text-purple-600 dark:text-purple-400' :
              userRole === 'TUTOR' ? 'text-green-600 dark:text-green-400' :
              'text-blue-600 dark:text-blue-400'
            }>
              {userRole === 'ADMIN' ? '🛡️' : 
               userRole === 'TUTOR' ? '👨‍🏫' : '👨‍🎓'}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
            {userRole === 'ADMIN' ? 'Administrator Account' : 
             userRole === 'TUTOR' ? 'Tutor Account' : 
             userRole ? 'Student Account' : 'Unknown Role'}
          </h3>
          
          {userRole ? (
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
              {userRole === 'ADMIN' ? 
                'You have full access to manage users, content, and platform settings.' :
               userRole === 'TUTOR' ? 
                'You can answer student questions, upload materials, and help students learn.' :
                'You can ask questions, access learning materials, and earn points for participation.'}
            </p>
          ) : (
            <p className="text-yellow-600 dark:text-yellow-400 mt-2 max-w-md mx-auto">
              Your role could not be determined. The system needs to fetch your profile data.
            </p>
          )}
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>User ID: {userDetails?.id || 'Unknown'}</p>
            <p className="mt-1">API Status: Connected to student-stage-backend-apis.onrender.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
