import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Moon, Sun, Monitor, LogOut, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { theme, toggleTheme, setSystemTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <User size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {user?.profile?.full_name || user?.username || 'User'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
            {user?.profile?.role?.toLowerCase() || 'student'}
          </p>
        </div>
        
        <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-800 dark:text-white">
                {user?.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            
            <div className="p-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
              
              {/* Theme Switcher */}
              <div className="px-3 py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Theme</p>
                <div className="space-y-1">
                  <button
                    onClick={() => { toggleTheme(); setIsOpen(false); }}
                    className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <div className="flex items-center space-x-2">
                      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                    {theme !== 'system' && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => { setSystemTheme(); setIsOpen(false); }}
                    className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <div className="flex items-center space-x-2">
                      <Monitor size={16} />
                      <span>System</span>
                    </div>
                    {theme === 'system' && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
