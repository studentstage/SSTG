import {
  ArrowRight,
  BookOpen,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { team } from "../../config/team";

const disciplines = ["Technology", "Engineering", "Agriculture"];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="display-face text-xl font-bold">
          Student Stage
        </Link>
        <div className="flex items-center gap-2">
          <Link
            className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
            to="/login"
          >
            Log in
          </Link>
          <Link
            className="min-h-11 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            to="/register"
          >
            Create account
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:items-center md:pb-24 md:pt-20">
        <div className="page-enter max-w-2xl">
          <p className="eyebrow text-sm font-semibold text-success">
            Learn with your stage in mind
          </p>
          <h1 className="display-face mt-5 text-5xl font-semibold leading-[1.03] sm:text-7xl">
            Make your next question count.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
            Student Stage is a focused learning space for students building
            practical futures in technology, engineering, and agriculture.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 font-semibold text-primary-foreground"
              to="/register"
            >
              Start learning <ArrowRight size={18} />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md border px-5 font-semibold"
              to="/login"
            >
              I already have an account
            </Link>
          </div>
        </div>
        <div className="relative grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-primary p-6 text-primary-foreground sm:col-span-2">
            <MessageCircleQuestion size={28} />
            <p className="mt-12 text-2xl font-semibold">
              Ask clearly. Learn together.
            </p>
            <p className="mt-2 text-primary-foreground/75">
              A practical starting point for the questions that move your work
              forward.
            </p>
          </div>
          <div className="rounded-lg border bg-surface p-5">
            <BookOpen size={23} />
            <p className="mt-8 font-semibold">Useful resources</p>
            <p className="mt-2 text-sm text-foreground/60">
              A home for the material you return to.
            </p>
          </div>
          <div className="rounded-lg border bg-surface p-5">
            <Sparkles size={23} />
            <p className="mt-8 font-semibold">AI, when ready</p>
            <p className="mt-2 text-sm text-foreground/60">
              A future assistant with a secure path to arrive.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y bg-surface-muted">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-5 sm:px-8">
          <span className="mr-2 text-sm font-semibold text-foreground/60">
            Built for
          </span>
          {disciplines.map((item) => (
            <span
              key={item}
              className="rounded-full border bg-surface px-4 py-2 text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-sm font-semibold text-success">
            The people behind the platform
          </p>
          <h2 className="display-face mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Built by the {team.name}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-foreground/70">
            A small team bringing together thoughtful design, reliable
            technology, and useful connections for students.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {team.members.map((member) => (
            <article
              key={member.name}
              className="rounded-lg border bg-surface p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{member.name}</h3>
              <p className="mt-2 text-sm font-semibold text-success">
                {member.contribution}
              </p>
            </article>
          ))}
        </div>
      </section>
      <footer className="mx-auto max-w-7xl px-5 py-8 text-sm text-foreground/60 sm:px-8">
        <p>
          {team.name} ·{" "}
          <a className="underline" href={`mailto:${team.email}`}>
            {team.email}
          </a>
        </p>
      </footer>
    </main>
  );
}
