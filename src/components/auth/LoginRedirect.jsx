import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginRedirect = () => {
  const { userRole, loading } = useAuth();

  useEffect(() => {
    console.log('🔀 LoginRedirect checking:', { userRole, loading });
  }, [userRole, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Determining your dashboard...</p>
        </div>
      </div>
    );
  }

  console.log(`🎯 Redirecting user with role: ${userRole}`);

  switch (userRole) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'TUTOR':
      return <Navigate to="/tutor/dashboard" replace />;
    case 'STUDENT':
      return <Navigate to="/dashboard" replace />;
    default:
      console.warn('Unknown role, defaulting to student dashboard');
      return <Navigate to="/dashboard" replace />;
  }
};

export default LoginRedirect;
