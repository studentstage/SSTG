import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useSession } from "../features/auth/SessionProvider";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const StudentPage = lazy(() => import("./pages/StudentPage"));
const QuestionsPage = lazy(() => import("./pages/QuestionsPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function LoadingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      Loading...
    </main>
  );
}

function PublicBoundary() {
  const { isAuthenticated, status } = useSession();
  if (status === "restoring") return <LoadingPage />;
  if (isAuthenticated) return <Navigate to="/student" replace />;
  return <Outlet />;
}

function AuthenticatedBoundary() {
  const { isAuthenticated, status } = useSession();
  const location = useLocation();
  if (status === "restoring") return <LoadingPage />;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function RoleBoundary({ role }) {
  const { role: currentRole } = useSession();
  if (currentRole !== role) return <Navigate to="/student" replace />;
  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<PublicBoundary />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/app" element={<AuthenticatedBoundary />}>
          <Route index element={<Navigate to="/student" replace />} />
        </Route>
        <Route element={<AuthenticatedBoundary />}>
          <Route element={<RoleBoundary role="STUDENT" />}>
            <Route path="/student" element={<StudentPage />} />
            <Route path="/student/questions" element={<QuestionsPage />} />
            <Route path="/student/resources" element={<ResourcesPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/*" element={<StudentPage />} />
          </Route>
          <Route element={<RoleBoundary role="TUTOR" />}>
            <Route path="/tutor/*" element={<NotFoundPage />} />
          </Route>
          <Route element={<RoleBoundary role="ADMIN" />}>
            <Route path="/admin/*" element={<NotFoundPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
