import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, GraduationCap, Shield, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "", 
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/redirect", { replace: true });
        }, 300);
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (role) => {
    if (!loginAsDemo) {
      toast.error("Demo login service unavailable");
      return;
    }

    const res = loginAsDemo(role);
    if (res.success) {
      toast.success(`Welcome to Student Stage as ${role === 'STUDENT' ? 'Student' : role === 'TUTOR' ? 'Tutor' : 'Administrator'}!`);
      
      const targetPath = role === "ADMIN" 
        ? "/admin/dashboard" 
        : role === "TUTOR" 
        ? "/tutor/dashboard" 
        : "/dashboard";

      navigate(targetPath, { replace: true });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
          Sign in to access your learning dashboard
        </p>
      </div>

      {/* Prominent Offline / Fast Access Banner */}
      <div className="rounded-xl border border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/90 dark:bg-emerald-950/40 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-2">
          <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>Quick Demo Access (Backend Offline)</span>
        </div>
        <p className="text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed mb-3">
          Explore the fully functional student experience with mock data & interactive tools:
        </p>
        
        <button
          type="button"
          onClick={() => handleDemoSignIn("STUDENT")}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          <GraduationCap size={18} />
          <span>Continue as Demo Student (Instant Access)</span>
        </button>

        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/60">
          <button
            type="button"
            onClick={() => handleDemoSignIn("TUTOR")}
            className="py-1.5 px-3 rounded-md bg-white/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 text-xs font-semibold hover:bg-white text-center transition"
          >
            👨‍🏫 Demo Tutor
          </button>
          <button
            type="button"
            onClick={() => handleDemoSignIn("ADMIN")}
            className="py-1.5 px-3 rounded-md bg-white/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 text-xs font-semibold hover:bg-white text-center transition"
          >
            <Shield size={12} className="inline mr-1" />
            Demo Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
          <AlertCircle
            className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            size={20}
          />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="flex-shrink mx-3 text-xs uppercase font-bold tracking-wider text-gray-400 bg-white dark:bg-gray-800 px-2">
          Or sign in with email
        </span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={loading}
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              disabled={loading}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-gray-700 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
