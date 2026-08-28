import { AppProviders } from "./providers/AppProviders";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ErrorBoundary } from "./ErrorBoundary";
import "../App.css";

export default function FoundationApp() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
}
