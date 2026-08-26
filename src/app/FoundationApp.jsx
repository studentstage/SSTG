import { AppProviders } from "./providers/AppProviders";
import { Card } from "../components/ui/Card";

export default function FoundationApp() {
  return (
    <AppProviders>
      <main className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto max-w-3xl">
          <Card className="border-dashed p-8 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
              Student Stage
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Frontend foundation ready
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground/70">
              Product routes are intentionally deferred. This shell validates
              the application providers, semantic theme tokens, and accessible
              UI base.
            </p>
          </Card>
        </div>
      </main>
    </AppProviders>
  );
}
