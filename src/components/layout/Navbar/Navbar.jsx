import React from 'react';
import { Menu } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '../../../contexts/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  
  const currentPage = "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Menu button and page title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentPage}
          </h1>
        </div>

        {/* Right: User menu and notifications */}
        <div className="flex items-center space-x-4">
          {/* Notification bell (placeholder) */}
          <button className="relative p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
