import {
  ArrowLeft,
  CircleUserRound,
  Filter,
  LogOut,
  MessageCircleQuestion,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useSession } from "../../features/auth/SessionProvider";

export default function QuestionsPage() {
  const { user, logout, isDemoSession } = useSession();
  const name =
    user?.username || user?.first_name || user?.email?.split("@")[0] || null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/student" className="display-face text-xl font-bold">
            Student Stage
          </Link>
          <Button variant="ghost" onClick={() => logout()}>
            <LogOut size={17} aria-hidden="true" />
            Log out
          </Button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[13rem_1fr] lg:gap-16 lg:py-12">
        <aside aria-label="Student navigation" className="lg:border-r lg:pr-8">
          <p className="eyebrow text-xs font-semibold text-foreground/55">
            Workspace
          </p>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:block lg:space-y-2">
            <Link
              to="/student"
              className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"
            >
              <CircleUserRound size={17} aria-hidden="true" />
              Overview
            </Link>
            <Link
              to="/student/questions"
              aria-current="page"
              className="flex min-h-11 shrink-0 items-center gap-3 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircleQuestion size={17} aria-hidden="true" />
              Questions
            </Link>
            <span className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/45">
              <Filter size={17} aria-hidden="true" />
              Resources
            </span>
          </nav>
        </aside>
        <section
          className="page-enter min-w-0"
          aria-labelledby="questions-heading"
        >
          <Link
            to="/student"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground/65 hover:text-foreground"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to dashboard
          </Link>
          <div className="mt-8 flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow text-sm font-semibold text-success">
                Student questions
              </p>
              <h1
                id="questions-heading"
                className="display-face mt-4 text-4xl font-semibold sm:text-5xl"
              >
                Questions
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/65">
                Browse academic questions, learn from shared answers, and ask
                for help when you need it.
              </p>
              {name && (
                <p className="mt-4 text-sm text-foreground/55">
                  Signed in as <span className="font-semibold">{name}</span>
                </p>
              )}
            </div>
            <Button disabled className="shrink-0">
              <MessageCircleQuestion size={17} aria-hidden="true" />
              Ask a question
            </Button>
          </div>
          {isDemoSession && (
            <div
              role="status"
              className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-5"
            >
              <p className="eyebrow text-xs font-semibold text-warning">
                Development / Demo mode
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                You are viewing the Questions interface with a local demo
                session. Live questions are not connected while the backend is
                offline.
              </p>
            </div>
          )}
          <div className="mt-10 rounded-lg border bg-surface p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1">
                <Input
                  label="Search questions"
                  name="question-search"
                  placeholder="Available when questions are connected"
                  disabled
                  className="bg-background"
                />
              </div>
              <div className="lg:w-56">
                <label
                  htmlFor="question-category"
                  className="block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="question-category"
                  name="question-category"
                  disabled
                  className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm text-foreground/55"
                  defaultValue="all"
                >
                  <option value="all">All categories</option>
                </select>
              </div>
              <Button variant="secondary" disabled>
                <Search size={17} aria-hidden="true" />
                Search
              </Button>
            </div>
            <p className="mt-4 text-sm text-foreground/55">
              Search and filtering will be connected to live question data in a
              future release.
            </p>
          </div>
          <div
            role="status"
            aria-live="polite"
            className="mt-8 rounded-lg border border-dashed bg-surface px-6 py-14 text-center sm:px-10"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <MessageCircleQuestion size={26} aria-hidden="true" />
            </div>
            <h2 className="display-face mt-6 text-3xl font-semibold">
              Questions will appear here
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-foreground/60">
              Live Questions data is unavailable until the Student Stage backend
              is connected. No questions have been loaded in this demo.
            </p>
            <p className="mt-5 text-sm font-semibold text-foreground/50">
              Not available yet
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
