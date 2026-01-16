import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginRedirect = () => {
  const { userRole, loading, refreshUserData, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && !userRole && refreshUserData) {
      refreshUserData();
    }
  }, [loading, isAuthenticated, userRole, refreshUserData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Determining your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Fetching your profile...
          </p>
        </div>
      </div>
    );
  }

  switch (userRole) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "TUTOR":
      return <Navigate to="/tutor/dashboard" replace />;
    case "STUDENT":
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default LoginRedirect;
