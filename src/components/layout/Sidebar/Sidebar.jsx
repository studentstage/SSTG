import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, BookOpen, User, 
  HelpCircle, Video, BarChart3, Users, FileText,
  Settings, LogOut, ChevronLeft, ChevronRight, Home,
  Shield, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { user, userRole, username, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState('STUDENT');
  
  // Update role when auth context updates
  useEffect(() => {
    console.log('Sidebar - User role changed:', userRole);
    setCurrentRole(userRole || 'STUDENT');
  }, [userRole]);

  // Role-based menu items
  const menuItems = {
    STUDENT: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
      { icon: <HelpCircle size={20} />, label: 'My Questions', path: '/student/questions' },
      { icon: <MessageSquare size={20} />, label: 'Answers', path: '/student/answers' },
      { icon: <BookOpen size={20} />, label: 'Books & Notes', path: '/student/books' },
      { icon: <Video size={20} />, label: 'Video Tutorials', path: '/student/videos' },
      { icon: <User size={20} />, label: 'AI Assistant', path: '/student/ai-assistant' },
      { icon: <MessageSquare size={20} />, label: 'Chat', path: '/student/chat' },
      { icon: <BarChart3 size={20} />, label: 'My Stats', path: '/student/stats' },
    ],
    TUTOR: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/tutor/dashboard' },
      { icon: <HelpCircle size={20} />, label: 'Questions', path: '/tutor/questions' },
      { icon: <MessageSquare size={20} />, label: 'My Answers', path: '/tutor/answers' },
      { icon: <BookOpen size={20} />, label: 'Upload Materials', path: '/tutor/upload' },
      { icon: <FileText size={20} />, label: 'Assignments', path: '/tutor/assignments' },
      { icon: <Users size={20} />, label: 'My Students', path: '/tutor/students' },
      { icon: <MessageSquare size={20} />, label: 'Chat', path: '/tutor/chat' },
      { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/tutor/analytics' },
    ],
    ADMIN: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: <Users size={20} />, label: 'User Management', path: '/admin/users' },
      { icon: <HelpCircle size={20} />, label: 'Content Moderation', path: '/admin/moderation' },
      { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
      { icon: <FileText size={20} />, label: 'News Management', path: '/admin/news' },
      { icon: <BookOpen size={20} />, label: 'Books Management', path: '/admin/books' },
      { icon: <Settings size={20} />, label: 'System Settings', path: '/admin/settings' },
    ]
  };

  const currentMenuItems = menuItems[currentRole] || menuItems.STUDENT;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Get role icon based on current role
  const getRoleIcon = () => {
    switch(currentRole) {
      case 'ADMIN': return <Shield size={16} className="text-purple-600 dark:text-purple-400" />;
      case 'TUTOR': return <GraduationCap size={16} className="text-green-600 dark:text-green-400" />;
      default: return <User size={16} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <aside className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${collapsed ? 'w-16' : 'w-[250px]'} transition-all duration-300`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white">
              Student's Stage
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <Home size={20} className="text-white" />
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* User Info */}
      <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${collapsed ? 'hidden' : 'block'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 dark:text-white truncate">
              {username || 'User'}
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                {getRoleIcon()}
                <span className="capitalize">{currentRole.toLowerCase()}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                ID: {user?.id || user?.user?.id || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {currentMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            currentRole === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
            currentRole === 'TUTOR' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
            'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
          }`}>
            {getRoleIcon()}
            <span className="ml-1.5 capitalize">{currentRole.toLowerCase()} PRIVILEGES</span>
          </div>
        </div>
      )}

      {/* Footer/Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!collapsed ? (
          <>
            <Link
              to="/settings"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={onClose}
            >
              <Settings size={20} />
              <span className="ml-3">Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition mt-2"
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </>
        ) : (
          <>
            <button className="w-full flex justify-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
            >
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
