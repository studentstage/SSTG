import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "./auth-api";
import { demoAuth, isDemoToken } from "./demo-auth";
import { clearSession, readSession, writeSession } from "./session-storage";

const SessionContext = createContext(null);

function getInitialSession() {
  const initialSession = readSession();
  if (isDemoToken(initialSession.token)) {
    if (demoAuth.enabled) return { token: demoAuth.token, user: demoAuth.user };
    clearSession();
    return { token: null, user: null };
  }
  return initialSession;
}

function getRole(user) {
  const role =
    user?.role ||
    user?.profile?.role ||
    user?.user?.profile?.role ||
    user?.user?.role;
  return role ? role.toUpperCase() : null;
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(getInitialSession);
  const [status, setStatus] = useState(() =>
    getInitialSession().token ? "restoring" : "guest",
  );

  const setAuthenticated = (token, user) => {
    writeSession(token, user);
    setSession({ token, user });
    setStatus("authenticated");
  };

  const clear = () => {
    clearSession();
    setSession({ token: null, user: null });
    setStatus("guest");
  };

  useEffect(() => {
    const sync = () => {
      const next = readSession();
      if (isDemoToken(next.token) && !demoAuth.enabled) {
        clearSession();
        setSession({ token: null, user: null });
        setStatus("guest");
        return;
      }
      setSession(next);
      setStatus(next.token ? "authenticated" : "guest");
    };
    window.addEventListener("storage", sync);
    window.addEventListener("auth:logout", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth:logout", sync);
    };
  }, []);

  useEffect(() => {
    if (!session.token) return undefined;
    if (isDemoToken(session.token)) {
      return undefined;
    }
    const controller = new AbortController();
    authApi
      .getCurrentUser({ signal: controller.signal })
      .then((user) => {
        setAuthenticated(session.token, user);
      })
      .catch((error) => {
        if (error.kind !== "canceled") clear();
      });
    return () => controller.abort();
  }, [session.token]);

  const login = async (email, password, config) => {
    setStatus("authenticating");
    try {
      const response = await authApi.login(email, password, config);
      const token = response?.["Access Token"] || response?.["ACCESS TOKEN"];
      if (!token)
        throw new Error("The login response did not include a token.");
      const user = await authApi.getCurrentUser(config);
      setAuthenticated(token, user);
      return user;
    } catch (error) {
      setStatus("guest");
      throw error;
    }
  };

  const register = async (userData, config) => {
    setStatus("authenticating");
    try {
      const response = await authApi.register(userData, config);
      const token = response?.["Access Token"] || response?.["ACCESS TOKEN"];
      if (token) {
        const user = await authApi.getCurrentUser(config);
        setAuthenticated(token, user);
        return { response, user };
      }
      setStatus("guest");
      return { response, user: null };
    } catch (error) {
      setStatus("guest");
      throw error;
    }
  };

  const demoLogin = () => {
    if (!demoAuth.enabled) {
      throw new Error("Development demo authentication is disabled.");
    }
    setAuthenticated(demoAuth.token, demoAuth.user);
  };

  const logout = async (config) => {
    const hadSession = Boolean(session.token);
    try {
      if (hadSession && !isDemoToken(session.token)) {
        await authApi.logout(config);
      }
    } finally {
      clear();
      window.dispatchEvent(new Event("auth:logout"));
    }
  };

  const refreshUser = async (config) => {
    if (!session.token) return null;
    const user = await authApi.getCurrentUser(config);
    setAuthenticated(session.token, user);
    return user;
  };

  const value = {
    user: session.user,
    token: session.token,
    status,
    isAuthenticated: Boolean(session.token),
    role: getRole(session.user),
    isDemoSession: isDemoToken(session.token),
    login,
    register,
    demoLogin,
    demoAuthEnabled: demoAuth.enabled,
    logout,
    refreshUser,
    clear,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within SessionProvider");
  return context;
}
