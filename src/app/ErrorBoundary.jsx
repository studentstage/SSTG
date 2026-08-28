import { Component } from "react";
import { Button } from "../components/ui/Button";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
        <div className="w-full max-w-md space-y-5 text-center">
          <p className="eyebrow text-sm font-semibold text-foreground/60">
            Student Stage
          </p>
          <h1 className="display-face text-4xl font-semibold">
            Something went wrong.
          </h1>
          <p className="text-foreground/70">
            This screen could not load. Try again or reload the app.
          </p>
          <Button onClick={() => window.location.reload()}>Reload app</Button>
        </div>
      </main>
    );
  }
}
