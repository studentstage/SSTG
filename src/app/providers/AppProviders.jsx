import { ThemeProvider } from "../../features/theme/ThemeProvider";
import { SessionProvider } from "../../features/auth/SessionProvider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
