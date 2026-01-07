import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useRoleAccess = (requiredRole) => {
  const navigate = useNavigate();
  const { userRole, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    console.log('🔐 useRoleAccess check:', {
      requiredRole,
      userRole,
      isAuthenticated,
      loading
    });

    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      console.log(`🚫 Access denied. ${userRole} cannot access ${requiredRole} route`);
      
      // Redirect based on role
      let redirectTo = '/dashboard';
      if (userRole === 'ADMIN') redirectTo = '/admin/dashboard';
      if (userRole === 'TUTOR') redirectTo = '/tutor/dashboard';
      
      navigate(redirectTo);
    }
  }, [userRole, loading, isAuthenticated, requiredRole, navigate]);

  return { userRole, loading, isAuthenticated };
};
