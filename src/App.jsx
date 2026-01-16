import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import HomePage from "./pages/public/HomePage";
import UnderConstruction from "./pages/public/UnderConstruction";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import TutorDashboard from "./pages/dashboard/tutor/TutorDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import UserManagement from "./pages/dashboard/admin/UserManagement";
import LoginRedirect from "./components/auth/LoginRedirect";
import { useAuth } from "./contexts/AuthContext";

const RequireRole = ({ role, children }) => {
  const { loading, isAuthenticated, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/redirect" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "#10b981",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />

            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
              </Route>

              {/* Auth Routes (Login/Register) */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Redirect after login */}
              <Route path="/redirect" element={<LoginRedirect />} />

              {/* Protected Dashboard Routes */}
              <Route element={<DashboardLayout />}>
                {/* Student Dashboard (also default for unknown roles) */}
                <Route
                  path="/dashboard"
                  element={
                    <RequireRole role="STUDENT">
                      <StudentDashboard />
                    </RequireRole>
                  }
                />

                {/* Tutor Dashboard */}
                <Route
                  path="/tutor/dashboard"
                  element={
                    <RequireRole role="TUTOR">
                      <TutorDashboard />
                    </RequireRole>
                  }
                />

                {/* Admin Dashboard */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <RequireRole role="ADMIN">
                      <AdminDashboard />
                    </RequireRole>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RequireRole role="ADMIN">
                      <UserManagement />
                    </RequireRole>
                  }
                />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<UnderConstruction />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
