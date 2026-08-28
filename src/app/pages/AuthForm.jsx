import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useSession } from "../../features/auth/SessionProvider";

export function AuthForm({ mode }) {
  const isLogin = mode === "login";
  const { login, register, demoLogin, demoAuthEnabled } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const update = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  const continueAsDemo = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      demoLogin();
      navigate(location.state?.from?.pathname || "/student", { replace: true });
    } catch (demoError) {
      setError(demoError.message);
      setLoading(false);
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldError("");
    setMessage("");
    if (
      !values.email ||
      !values.password ||
      (!isLogin && (!values.username || !values.confirmPassword))
    ) {
      setFieldError("Complete all required fields.");
      return;
    }
    if (!isLogin && values.password !== values.confirmPassword) {
      setFieldError("Passwords must match.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) await login(values.email, values.password);
      else {
        const result = await register(values);
        if (!result.user) {
          navigate("/login", {
            replace: true,
            state: { message: "Account created. Please log in." },
          });
          return;
        }
      }
      navigate(location.state?.from?.pathname || "/student", { replace: true });
    } catch (requestError) {
      const messages = {
        authentication:
          "Those credentials were not accepted. Check them and try again.",
        network:
          "We could not reach Student Stage. Check your connection and try again.",
        timeout: "Student Stage took too long to respond. Please try again.",
        server:
          "Student Stage is having trouble right now. Please try again shortly.",
      };
      setError(
        messages[requestError.kind] ||
          requestError.message ||
          "We could not complete that request.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground sm:px-8">
      <div className="page-enter w-full max-w-md">
        <Link to="/" className="display-face text-xl font-bold">
          Student Stage
        </Link>
        <div className="mt-10">
          <p className="eyebrow text-sm font-semibold text-success">
            {isLogin ? "Welcome back" : "Your learning space"}
          </p>
          <h1 className="display-face mt-3 text-4xl font-semibold">
            {isLogin ? "Log in to continue" : "Create your account"}
          </h1>
          <p className="mt-3 text-foreground/65">
            {isLogin
              ? "Pick up where your learning left off."
              : "Join a focused community for practical STEM learning."}
          </p>
        </div>
        {message && (
          <p role="status" className="mt-6 text-sm text-success">
            {message}
          </p>
        )}
        <form
          className="mt-8 space-y-5"
          onSubmit={submit}
          noValidate
          aria-busy={loading}
        >
          {!isLogin && (
            <Input
              label="Username"
              name="username"
              autoComplete="username"
              value={values.username}
              onChange={update}
              required
            />
          )}
          {!isLogin && (
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={update}
              required
            />
          )}
          {isLogin && (
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={update}
              required
            />
          )}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={values.password}
              onChange={update}
              required
              className="pr-12"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-8 min-h-11 min-w-11 rounded-md p-3 text-foreground/60 hover:bg-surface-muted"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {!isLogin && (
            <Input
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={update}
              required
            />
          )}
          {fieldError && (
            <p
              role="alert"
              aria-live="assertive"
              className="text-sm text-destructive"
            >
              {fieldError}
            </p>
          )}
          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <Button type="submit" loading={loading} className="w-full">
            {isLogin ? "Log in" : "Create account"}
          </Button>
        </form>
        {isLogin && demoAuthEnabled && (
          <div className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-5">
            <p className="eyebrow text-xs font-semibold text-warning">
              Development / Demo mode
            </p>
            <p className="mt-3 text-sm text-foreground/70">
              The backend is offline. Enter the student workspace with a local
              demo session; this does not authenticate against the server.
            </p>
            <button
              type="button"
              disabled={loading}
              aria-busy={loading || undefined}
              onClick={continueAsDemo}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-opacity hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "Continue as Demo Student"}
            </button>
          </div>
        )}
        <p className="mt-6 text-center text-sm text-foreground/65">
          {isLogin ? "New to Student Stage? " : "Already have an account? "}
          <Link
            className="font-semibold text-foreground underline"
            to={isLogin ? "/register" : "/login"}
          >
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
