import {
  ArrowLeft,
  BookOpen,
  CircleUserRound,
  Filter,
  LogOut,
  MessageCircleQuestion,
  Search,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { faculties, facultyById } from "../../config/academics";
import { useSession } from "../../features/auth/SessionProvider";

const seedQuestions = [
  { id: "q-1", title: "How do I choose the right data structure for a problem?", body: "I understand arrays and linked lists, but I am not yet sure how to decide which structure fits a problem best.", category: "Computer Science", author: "Chiamaka O.", time: "2 hours ago", answers: 4, likes: 12 },
  { id: "q-2", title: "What is the difference between a series and a parallel circuit?", body: "Could someone explain the practical difference, especially what happens to the current and voltage in each circuit?", category: "Electrical Engineering", author: "David A.", time: "Yesterday", answers: 7, likes: 18 },
  { id: "q-3", title: "Which soil test should I use before planting vegetables?", body: "I want to begin a small vegetable garden and would like to know the most useful soil properties to test first.", category: "Crop Science", author: "Favour E.", time: "2 days ago", answers: 3, likes: 9 },
  { id: "q-4", title: "How can I make a study timetable that I actually follow?", body: "I keep making schedules that look good on paper but become difficult to maintain after a few days.", category: "Mathematics", author: "Ibrahim K.", time: "3 days ago", answers: 6, likes: 24 },
];
const facultyForDepartment = Object.fromEntries(
  faculties.flatMap((faculty) =>
    faculty.departments.map((department) => [department, faculty.id]),
  ),
);
export default function QuestionsPage() {
  const { user, logout, isDemoSession } = useSession();
  const [questions, setQuestions] = useState(seedQuestions);
  const [query, setQuery] = useState("");
  const [facultyId, setFacultyId] = useState("all");
  const [department, setDepartment] = useState("all");
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", facultyId: "facms", department: "Computer Science" });
  const [draftError, setDraftError] = useState("");
  const [liked, setLiked] = useState([]);
  const name = user?.username || user?.first_name || user?.email?.split("@")[0] || "You";
  const selectedFaculty = facultyById[facultyId];
  const draftFaculty = facultyById[draft.facultyId];
  const filteredQuestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return questions.filter((question) => (facultyId === "all" || facultyForDepartment[question.category] === facultyId) && (department === "all" || question.category === department) && (!normalizedQuery || `${question.title} ${question.body} ${question.category}`.toLowerCase().includes(normalizedQuery)));
  }, [department, facultyId, query, questions]);
  const submitQuestion = (event) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) { setDraftError("Add both a clear title and some details before posting."); return; }
    setQuestions((current) => [{ id: `local-${Date.now()}`, title: draft.title.trim(), body: draft.body.trim(), category: draft.department, author: name, time: "Just now", answers: 0, likes: 0 }, ...current]);
    setDraft({ title: "", body: "", facultyId: "facms", department: "Computer Science" }); setDraftError(""); setShowComposer(false);
  };
  const toggleLike = (id) => setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-surface"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link to="/student" className="display-face text-xl font-bold">Student Stage</Link><Button variant="ghost" onClick={() => logout()}><LogOut size={17} aria-hidden="true" />Log out</Button></div></header>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[13rem_1fr] lg:gap-16 lg:py-12">
        <aside aria-label="Student navigation" className="lg:border-r lg:pr-8"><p className="eyebrow text-xs font-semibold text-foreground/55">Workspace</p><nav className="mt-4 flex gap-2 overflow-x-auto lg:block lg:space-y-2"><Link to="/student" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><CircleUserRound size={17} aria-hidden="true" />Overview</Link><Link to="/student/questions" aria-current="page" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><MessageCircleQuestion size={17} aria-hidden="true" />Questions</Link><Link to="/student/resources" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><BookOpen size={17} aria-hidden="true" />Resources</Link><Link to="/student/profile" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><CircleUserRound size={17} aria-hidden="true" />Profile</Link></nav></aside>
        <section className="page-enter min-w-0" aria-labelledby="questions-heading">
          <Link to="/student" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground/65 hover:text-foreground"><ArrowLeft size={17} aria-hidden="true" />Back to dashboard</Link>
          <div className="mt-8 flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-start lg:justify-between"><div><p className="eyebrow text-sm font-semibold text-success">Student questions</p><h1 id="questions-heading" className="display-face mt-4 text-4xl font-semibold sm:text-5xl">Ask. Share. Learn.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/65">Explore questions from your learning community or share the one you are working through.</p></div><Button className="shrink-0" onClick={() => setShowComposer((open) => !open)}><MessageCircleQuestion size={17} aria-hidden="true" />{showComposer ? "Close form" : "Ask a question"}</Button></div>
          {isDemoSession && <div role="status" className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-5"><p className="eyebrow text-xs font-semibold text-warning">Demo mode</p><p className="mt-2 text-sm leading-6 text-foreground/70">Questions, likes, and posts are stored only while this demo is open. They will later connect to the Student Stage API.</p></div>}
          {showComposer && <form onSubmit={submitQuestion} className="mt-8 rounded-lg border bg-surface p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">Ask the community</h2><p className="mt-1 text-sm text-foreground/60">A specific title and a little context make it easier to help.</p></div><Send size={20} className="mt-1 text-success" aria-hidden="true" /></div><div className="mt-6 grid gap-5"><Input label="Question title" name="question-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="For example: How do I…" maxLength={120} /><div><label htmlFor="question-body" className="block text-sm font-medium">More details</label><textarea id="question-body" value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="Explain what you have tried or where you are stuck." className="mt-2 min-h-32 w-full rounded-md border bg-background px-3 py-3 text-sm placeholder:text-foreground/50" maxLength={800} /></div><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="new-question-faculty" className="block text-sm font-medium">Faculty</label><select id="new-question-faculty" value={draft.facultyId} onChange={(event) => { const nextFacultyId = event.target.value; setDraft({ ...draft, facultyId: nextFacultyId, department: facultyById[nextFacultyId].departments[0] }); }} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm">{faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.shortName} — {faculty.name}</option>)}</select></div><div><label htmlFor="new-question-department" className="block text-sm font-medium">Department</label><select id="new-question-department" value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value })} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm">{draftFaculty.departments.map((item) => <option key={item}>{item}</option>)}</select></div></div>{draftError && <p role="alert" className="text-sm text-destructive">{draftError}</p>}<div className="flex flex-wrap gap-3"><Button type="submit"><Send size={17} aria-hidden="true" />Post question</Button><Button variant="ghost" onClick={() => setShowComposer(false)}>Cancel</Button></div></div></form>}
          <div className="mt-10 rounded-lg border bg-surface p-5 sm:p-6"><div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem_16rem_auto] lg:items-end"><Input label="Search questions" name="question-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic, keyword, or department" /><div><label htmlFor="question-faculty" className="block text-sm font-medium">Faculty</label><select id="question-faculty" value={facultyId} onChange={(event) => { setFacultyId(event.target.value); setDepartment("all"); }} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm"><option value="all">All faculties</option>{faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.shortName}</option>)}</select></div><div><label htmlFor="question-department" className="block text-sm font-medium">Department</label><select id="question-department" value={department} disabled={!selectedFaculty} onChange={(event) => setDepartment(event.target.value)} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"><option value="all">{selectedFaculty ? "All departments" : "Choose a faculty first"}</option>{selectedFaculty?.departments.map((item) => <option key={item}>{item}</option>)}</select></div><div className="flex min-h-11 items-center gap-2 text-sm text-foreground/55"><Filter size={17} aria-hidden="true" />{filteredQuestions.length} shown</div></div></div>
          <div className="mt-8 space-y-4" aria-live="polite">{filteredQuestions.map((question) => { const hasLiked = liked.includes(question.id); return <article key={question.id} className="rounded-lg border bg-surface p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{question.category}</span><h2 className="mt-4 text-xl font-semibold leading-7">{question.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/65">{question.body}</p></div><span className="shrink-0 text-xs text-foreground/50">{question.time}</span></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="text-sm text-foreground/60">Asked by <span className="font-semibold text-foreground">{question.author}</span></p><div className="flex items-center gap-2"><span className="rounded-md bg-surface-muted px-3 py-2 text-sm font-semibold">{question.answers} {question.answers === 1 ? "answer" : "answers"}</span><button type="button" onClick={() => toggleLike(question.id)} aria-pressed={hasLiked} className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold ${hasLiked ? "bg-primary text-primary-foreground" : "hover:bg-surface-muted"}`}><ThumbsUp size={16} aria-hidden="true" />{question.likes + (hasLiked ? 1 : 0)}</button></div></div></article>; })}{filteredQuestions.length === 0 && <div className="rounded-lg border border-dashed bg-surface px-6 py-14 text-center"><Search size={26} className="mx-auto" aria-hidden="true" /><h2 className="display-face mt-5 text-2xl font-semibold">No questions found</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground/60">Try another search term or remove the faculty and department filters. You can also ask the first question on this topic.</p><Button variant="secondary" className="mt-6" onClick={() => { setQuery(""); setFacultyId("all"); setDepartment("all"); }}>Clear filters</Button></div>}</div>
        </section>
      </div>
    </main>
  );
}
