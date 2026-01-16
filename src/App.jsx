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
import LoginRedirect from "./components/auth/LoginRedirect";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
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
                {/* Default dashboard - shows based on role */}
                <Route path="/" element={<LoginRedirect />} />

                {/* Student Dashboard (also default for unknown roles) */}
                <Route path="/dashboard" element={<StudentDashboard />} />

                {/* Tutor Dashboard */}
                <Route path="/tutor/dashboard" element={<TutorDashboard />} />

                {/* Admin Dashboard */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
