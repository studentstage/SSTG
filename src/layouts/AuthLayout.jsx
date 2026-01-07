import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated/Illustration Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <GraduationCap size={80} className="animate-bounce" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            STUDENT's STAGE
          </h1>
          
          <p className="text-xl mb-6">
            Where Students Learn, Share, and Grow Together
          </p>
          
          <div className="space-y-4 text-left bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Ask questions and get expert answers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Access learning materials and resources</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Connect with tutors and peers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Track your progress with points and stars</span>
            </div>
          </div>
          
          <div className="mt-8 text-sm opacity-80">
            <p>Already have an account? <Link to="/login" className="underline hover:opacity-90">Sign In</Link></p>
            <p className="mt-2">New here? <Link to="/register" className="underline hover:opacity-90">Create Account</Link></p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <GraduationCap size={40} className="text-blue-600" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">STUDENT's STAGE</span>
            </div>
          </div>
          
          {/* Form Content */}
          <Outlet />
          
          {/* Mobile Links */}
          <div className="lg:hidden mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
