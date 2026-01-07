import React, { useState, useEffect } from 'react';
import { 
  BookOpen, MessageSquare, Users, Award, Clock, Plus, User,
  HelpCircle, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TutorDashboard = () => {
  const { user, userRole, username, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    console.log('Tutor Dashboard - User data:', {
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
          username: user.user?.username || 'Tutor',
          email: user.user?.email || '',
          role: user.role || 'TUTOR',
          profileId: user.id,
          fullName: user.full_name || '',
          dateJoined: user.date_joined || '',
        };
      } else if (user.profile) {
        details = {
          id: user.id,
          username: user.username || 'Tutor',
          email: user.email || '',
          role: user.profile?.role || 'TUTOR',
          profileId: user.profile?.id,
          fullName: user.profile?.full_name || '',
          dateJoined: user.profile?.date_joined || '',
        };
      } else {
        details = {
          id: user.id || 'N/A',
          username: user.username || 'Tutor',
          email: user.email || '',
          role: userRole || 'TUTOR',
          fullName: user.full_name || '',
        };
      }
      
      setUserDetails(details);
      console.log('Tutor extracted details:', details);
    }
  }, [user, userRole, username]);

  const stats = [
    { icon: <MessageSquare size={24} />, label: 'Questions Answered', value: '0', color: 'green', trend: '+5 this week' },
    { icon: <BookOpen size={24} />, label: 'Materials Uploaded', value: '0', color: 'blue' },
    { icon: <Users size={24} />, label: 'Students Helped', value: '0', color: 'purple', trend: '+3 today' },
    { icon: <Award size={24} />, label: 'Average Rating', value: '4.8', color: 'yellow', status: 'Based on 24 reviews' },
  ];

  const quickActions = [
    { icon: <Plus size={20} />, label: 'Answer Questions', color: 'bg-green-500 dark:bg-green-600' },
    { icon: <BookOpen size={20} />, label: 'Upload Materials', color: 'bg-blue-500 dark:bg-blue-600' },
    { icon: <MessageSquare size={20} />, label: 'View My Answers', color: 'bg-purple-500 dark:bg-purple-600' },
    { icon: <Users size={20} />, label: 'My Students', color: 'bg-orange-500 dark:bg-orange-600' },
  ];

  const pendingQuestions = [
    { subject: 'Mathematics', question: 'How to solve quadratic equations?', time: '2 hours ago' },
    { subject: 'Physics', question: 'Explain Newton\'s third law', time: '5 hours ago' },
    { subject: 'Biology', question: 'What is photosynthesis?', time: '1 day ago' },
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
            Tutor Dashboard
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <User size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Role: <span className="font-medium capitalize">{userRole?.toLowerCase() || 'tutor'}</span>
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
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Tutor Debug Info</h3>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
              <p>User Role: <code>{userRole || 'Not set'}</code></p>
              <p>Username: <code>{username || 'Not set'}</code></p>
              <p>User ID: <code>{userDetails?.id || 'Not set'}</code></p>
            </div>
          </div>
          <button
            onClick={() => {
              console.log('Tutor - Full user object:', user);
              console.log('Tutor - LocalStorage:', localStorage.getItem('user_data'));
              toast.success('Tutor data logged to console');
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
            
            {stat.trend && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                {stat.trend}
              </p>
            )}
            
            {stat.status && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {stat.status}
              </p>
            )}
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
              onClick={() => toast.success(`Redirecting to ${action.label}`)}
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

      {/* Pending Questions */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Questions</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{pendingQuestions.length} waiting</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {pendingQuestions.map((question, index) => (
              <div key={index} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                      {question.subject}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} className="inline mr-1" />
                      {question.time}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{question.question}</p>
                </div>
                <button 
                  className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  onClick={() => toast.success(`Answering: ${question.question}`)}
                >
                  Answer
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Need help with tutoring?</span>
            <button className="text-blue-600 dark:text-blue-400 hover:underline">
              View Tutor Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* Role Information */}
      <div className="card p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
            <GraduationCap className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
            Tutor Account
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
            As a tutor, you have the ability to answer student questions, upload learning materials, 
            and help students achieve their academic goals. Your contributions are valuable to the learning community.
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Tutor privileges active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
