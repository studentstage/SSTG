import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "./auth-api";
import { clearSession, readSession, writeSession } from "./session-storage";

const SessionContext = createContext(null);

function getRole(user) {
  const role =
    user?.role ||
    user?.profile?.role ||
    user?.user?.profile?.role ||
    user?.user?.role;
  return role ? role.toUpperCase() : null;
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => readSession());
  const [status, setStatus] = useState(() =>
    readSession().token ? "restoring" : "guest",
  );

  useEffect(() => {
    const sync = () => {
      const next = readSession();
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
    const controller = new AbortController();
    authApi
      .getCurrentUser({ signal: controller.signal })
      .then((user) => {
        writeSession(session.token, user);
        setSession({ token: session.token, user });
        setStatus("authenticated");
      })
      .catch((error) => {
        if (error.kind !== "canceled" && error.kind !== "authentication")
          setStatus("authenticated");
      });
    return () => controller.abort();
  }, [session.token]);

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      status,
      isAuthenticated: Boolean(session.token),
      role: getRole(session.user),
      clear: () => {
        clearSession();
        setSession({ token: null, user: null });
        setStatus("guest");
      },
    }),
    [session, status],
  );

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
