import {
  ArrowUpRight,
  BookOpen,
  CircleUserRound,
  Clock3,
  LogOut,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useSession } from "../../features/auth/SessionProvider";

export default function StudentPage() {
  const { user, logout, isDemoSession } = useSession();
  const name =
    user?.username ||
    user?.first_name ||
    user?.email?.split("@")[0] ||
    "student";
  const items = [
    {
      icon: MessageCircleQuestion,
      title: "Questions",
      text: "Your questions and answers will appear here once the service is available.",
      action: "Not available yet",
    },
    {
      icon: BookOpen,
      title: "Learning resources",
      text: "Curated learning material will have a home here in a future release.",
      action: "Coming soon",
    },
    {
      icon: Sparkles,
      title: "AI Study Assistant",
      text: "A secure AI integration is planned and will require a backend gateway.",
      action: "Planned",
    },
    {
      icon: CircleUserRound,
      title: "Profile",
      text: "Your account and learning details will be connected here next.",
      action: "Coming soon",
    },
  ];
  const quickActions = [
    { icon: MessageCircleQuestion, title: "Questions", status: "Coming soon" },
    { icon: MessageCircleQuestion, title: "Answers", status: "Coming soon" },
    { icon: BookOpen, title: "Books", status: "Coming soon" },
    { icon: BookOpen, title: "Videos", status: "Coming soon" },
    { icon: Sparkles, title: "AI Assistant", status: "Coming soon" },
  ];
  const overview = [
    {
      label: "Questions",
      text: "Your questions will appear here when the backend is connected.",
    },
    {
      label: "Answers",
      text: "Answers and conversations will be available in a future release.",
    },
    {
      label: "Learning resources",
      text: "Books and videos will connect here when resources are available.",
    },
    {
      label: "Activity",
      text: "Activity insights will appear here without invented statistics.",
    },
  ];
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
              aria-current="page"
              className="flex min-h-11 shrink-0 items-center gap-3 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              <CircleUserRound size={17} aria-hidden="true" />
              Overview
            </Link>
            <Link
              to="/student/questions"
              className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"
            >
              <MessageCircleQuestion size={17} aria-hidden="true" />
              Questions
            </Link>
            <span className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/45">
              <BookOpen size={17} aria-hidden="true" />
              Resources
            </span>
          </nav>
        </aside>
        <section className="page-enter min-w-0">
          <div className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow text-sm font-semibold text-success">
                Student workspace
              </p>
              <h1 className="display-face mt-4 text-4xl font-semibold sm:text-5xl">
                Good to see you, {name}.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-foreground/65">
                Your learning home is ready. Start with what matters when the
                next service becomes available.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-md border bg-surface px-3 py-2 text-sm">
              <Clock3 size={17} aria-hidden="true" className="text-success" />
              <span>{isDemoSession ? "Demo session" : "Live session"}</span>
            </div>
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
                You are viewing the student experience with a local demo
                session. Account data and learning services are not connected
                while the backend is offline.
              </p>
            </div>
          )}
          <div className="mt-10 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-xs font-semibold text-foreground/55">
                Your tools
              </p>
              <h2 className="display-face mt-2 text-3xl font-semibold">
                A clear place to begin
              </h2>
            </div>
            <span className="hidden text-sm text-foreground/50 sm:inline">
              {quickActions.length} areas planned
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {quickActions.map(({ icon: Icon, title, status }) => (
              <button
                key={title}
                type="button"
                disabled
                aria-label={`${title}, ${status}`}
                className="group flex min-h-28 flex-col items-start justify-between rounded-lg border bg-surface p-4 text-left opacity-75 transition-opacity disabled:cursor-not-allowed"
              >
                <span className="flex w-full items-center justify-between">
                  <Icon size={21} aria-hidden="true" />
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-xs text-foreground/55">
                    {status}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-10 xl:grid-cols-[1.15fr_.85fr]">
            <section aria-labelledby="overview-heading">
              <p className="eyebrow text-xs font-semibold text-foreground/55">
                Learning overview
              </p>
              <h2
                id="overview-heading"
                className="display-face mt-2 text-3xl font-semibold"
              >
                Your progress, when connected
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {overview.map(({ label, text }) => (
                  <article
                    key={label}
                    className="rounded-lg border bg-surface p-5"
                  >
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-3 text-sm leading-6 text-foreground/60">
                      {text}
                    </p>
                    <span className="mt-5 inline-block text-xs font-semibold text-foreground/50">
                      Not available yet
                    </span>
                  </article>
                ))}
              </div>
            </section>
            <section aria-labelledby="activity-heading">
              <p className="eyebrow text-xs font-semibold text-foreground/55">
                Recent activity
              </p>
              <h2
                id="activity-heading"
                className="display-face mt-2 text-3xl font-semibold"
              >
                Nothing here yet
              </h2>
              <div
                role="status"
                className="mt-6 rounded-lg border border-dashed bg-surface p-6"
              >
                <Clock3 size={23} aria-hidden="true" />
                <p className="mt-5 font-semibold">No recent activity yet</p>
                <p className="mt-2 text-sm leading-6 text-foreground/60">
                  Your questions, answers, and learning activity will appear
                  here when connected to the backend.
                </p>
              </div>
            </section>
          </div>
          <section aria-labelledby="resources-heading" className="mt-12">
            <p className="eyebrow text-xs font-semibold text-foreground/55">
              Resources
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2
                id="resources-heading"
                className="display-face text-3xl font-semibold"
              >
                Learn at your own pace
              </h2>
              <span className="text-sm text-foreground/55">
                Books and videos coming soon
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {items.slice(1, 2).map(({ icon: Icon, title, text, action }) => (
                <article
                  key={title}
                  className="rounded-lg border bg-surface p-6"
                >
                  <Icon size={24} aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/65">
                    {text}
                  </p>
                  <span className="mt-5 inline-block text-sm font-semibold text-foreground/55">
                    {action}
                  </span>
                </article>
              ))}
              <article className="rounded-lg border bg-surface p-6">
                <Sparkles size={24} aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold">AI Assistant</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/65">
                  A secure AI assistant will arrive through a backend gateway.
                </p>
                <span className="mt-5 inline-block text-sm font-semibold text-foreground/55">
                  Coming soon
                </span>
              </article>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
