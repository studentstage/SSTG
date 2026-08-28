import {
  ArrowLeft,
  BookOpen,
  CircleUserRound,
  FileText,
  Heart,
  LogOut,
  PlayCircle,
  Search,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useSession } from "../../features/auth/SessionProvider";

const resources = [
  { id: "r-1", title: "Introduction to Data Structures", type: "Book", subject: "Technology", description: "A practical guide to arrays, stacks, queues, and linked lists.", format: "Reading guide · 42 pages" },
  { id: "r-2", title: "Circuit Fundamentals: Voltage and Current", type: "Video", subject: "Engineering", description: "A short visual lesson on the building blocks of electric circuits.", format: "Video lesson · 18 min" },
  { id: "r-3", title: "Soil Health Field Notes", type: "Study material", subject: "Agriculture", description: "A printable checklist for observing and improving soil before planting.", format: "Study guide · PDF" },
  { id: "r-4", title: "Problem-solving with Algorithms", type: "Book", subject: "Technology", description: "Use simple patterns to break difficult programming problems into smaller parts.", format: "Reading guide · 36 pages" },
  { id: "r-5", title: "Study Planning for Busy Weeks", type: "Study material", subject: "Study skills", description: "A flexible weekly planner and a few habits for using it consistently.", format: "Template · PDF" },
  { id: "r-6", title: "From Seed to Harvest", type: "Video", subject: "Agriculture", description: "An overview of planning, planting, care, and harvest for a small garden.", format: "Video lesson · 24 min" },
];

const filters = ["All resources", "Book", "Video", "Study material"];

function ResourceIcon({ type, ...props }) {
  if (type === "Video") return <Video {...props} />;
  if (type === "Study material") return <FileText {...props} />;
  return <BookOpen {...props} />;
}

export default function ResourcesPage() {
  const { logout, isDemoSession } = useSession();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All resources");
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState(null);
  const visibleResources = useMemo(() => {
    const term = query.trim().toLowerCase();
    return resources.filter((resource) => (filter === "All resources" || resource.type === filter) && (!term || `${resource.title} ${resource.subject} ${resource.description}`.toLowerCase().includes(term)));
  }, [filter, query]);
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-surface"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link to="/student" className="display-face text-xl font-bold">Student Stage</Link><Button variant="ghost" onClick={() => logout()}><LogOut size={17} aria-hidden="true" />Log out</Button></div></header>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[13rem_1fr] lg:gap-16 lg:py-12">
        <aside aria-label="Student navigation" className="lg:border-r lg:pr-8"><p className="eyebrow text-xs font-semibold text-foreground/55">Workspace</p><nav className="mt-4 flex gap-2 overflow-x-auto lg:block lg:space-y-2"><Link to="/student" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><CircleUserRound size={17} aria-hidden="true" />Overview</Link><Link to="/student/questions" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><FileText size={17} aria-hidden="true" />Questions</Link><Link to="/student/resources" aria-current="page" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><BookOpen size={17} aria-hidden="true" />Resources</Link><Link to="/student/profile" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><CircleUserRound size={17} aria-hidden="true" />Profile</Link></nav></aside>
        <section className="page-enter min-w-0" aria-labelledby="resources-heading">
          <Link to="/student" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground/65 hover:text-foreground"><ArrowLeft size={17} aria-hidden="true" />Back to dashboard</Link>
          <div className="mt-8 border-b pb-8"><p className="eyebrow text-sm font-semibold text-success">Student learning resources</p><h1 id="resources-heading" className="display-face mt-4 text-4xl font-semibold sm:text-5xl">Your study shelf.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/65">Find approachable books, video lessons, and practical materials for your next study session.</p></div>
          {isDemoSession && <div role="status" className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-5"><p className="eyebrow text-xs font-semibold text-warning">Demo mode</p><p className="mt-2 text-sm leading-6 text-foreground/70">These resources are local examples for the frontend MVP. Saved items remain only while this demo is open.</p></div>}
          <div className="mt-10 rounded-lg border bg-surface p-5 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-end"><div className="min-w-0 flex-1"><Input label="Search resources" name="resource-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, topics, or keywords" /></div><div className="lg:w-56"><label htmlFor="resource-filter" className="block text-sm font-medium">Resource type</label><select id="resource-filter" value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm">{filters.map((item) => <option key={item}>{item}</option>)}</select></div><div className="flex min-h-11 items-center gap-2 text-sm text-foreground/55"><Search size={17} aria-hidden="true" />{visibleResources.length} available</div></div></div>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-xs font-semibold text-foreground/55">Browse</p><h2 className="display-face mt-2 text-3xl font-semibold">Ready when you are</h2></div><span className="text-sm text-foreground/55">{saved.length} saved {saved.length === 1 ? "resource" : "resources"}</span></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">{visibleResources.map((resource) => { const isSaved = saved.includes(resource.id); return <article key={resource.id} className="flex min-h-72 flex-col rounded-lg border bg-surface p-5"><div className="flex items-start justify-between gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"><ResourceIcon type={resource.type} size={23} aria-hidden="true" /></div><button type="button" aria-label={isSaved ? `Remove ${resource.title} from saved resources` : `Save ${resource.title}`} aria-pressed={isSaved} onClick={() => toggleSaved(resource.id)} className={`flex h-11 w-11 items-center justify-center rounded-md border ${isSaved ? "bg-primary text-primary-foreground" : "hover:bg-surface-muted"}`}><Heart size={18} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" /></button></div><div className="mt-6"><p className="text-xs font-semibold text-success">{resource.subject} · {resource.type}</p><h3 className="mt-2 text-xl font-semibold leading-7">{resource.title}</h3><p className="mt-3 text-sm leading-6 text-foreground/65">{resource.description}</p></div><div className="mt-auto flex items-center justify-between gap-3 border-t pt-4"><span className="text-xs text-foreground/55">{resource.format}</span><button type="button" onClick={() => setSelected(resource)} className="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold hover:bg-surface-muted">{resource.type === "Video" ? <PlayCircle size={17} aria-hidden="true" /> : <BookOpen size={17} aria-hidden="true" />}View</button></div></article>; })}</div>
          {visibleResources.length === 0 && <div className="mt-6 rounded-lg border border-dashed bg-surface px-6 py-14 text-center"><Search size={26} className="mx-auto" aria-hidden="true" /><h2 className="display-face mt-5 text-2xl font-semibold">No resources found</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground/60">Try a different keyword or remove the resource-type filter.</p><Button variant="secondary" className="mt-6" onClick={() => { setQuery(""); setFilter("All resources"); }}>Clear filters</Button></div>}
          {selected && <section aria-live="polite" className="mt-10 rounded-lg border border-success/30 bg-surface p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow text-xs font-semibold text-success">Resource preview</p><h2 className="display-face mt-3 text-3xl font-semibold">{selected.title}</h2><p className="mt-3 max-w-2xl leading-7 text-foreground/65">{selected.description} Full files and videos will be linked here once the resource library is connected.</p></div><Button variant="ghost" onClick={() => setSelected(null)}>Close preview</Button></div></section>}
        </section>
      </div>
    </main>
  );
}
