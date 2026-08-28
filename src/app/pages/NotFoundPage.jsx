import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-center text-foreground">
      <div>
        <p className="eyebrow text-sm font-semibold text-foreground/55">404</p>
        <h1 className="display-face mt-4 text-5xl font-semibold">
          That page is not here.
        </h1>
        <Link
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground"
          to="/"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
