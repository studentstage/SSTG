import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleUserRound,
  FileText,
  LogOut,
  MessageCircleQuestion,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { faculties, facultyById } from "../../config/academics";
import { useSession } from "../../features/auth/SessionProvider";

const PROFILE_KEY = "student_stage_demo_profile";

function readProfile(user) {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (stored) return stored;
  } catch {
    localStorage.removeItem(PROFILE_KEY);
  }
  return {
    displayName: user?.username || user?.first_name || "",
    facultyId: "",
    department: "",
    level: "",
  };
}

export default function ProfilePage() {
  const { user, logout, isDemoSession } = useSession();
  const [profile, setProfile] = useState(() => readProfile(user));
  const [saved, setSaved] = useState(false);
  const selectedFaculty = facultyById[profile.facultyId];

  const update = (field, value) => {
    setSaved(false);
    setProfile((current) => ({
      ...current,
      [field]: value,
      ...(field === "facultyId" ? { department: "" } : {}),
    }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-surface"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link to="/student" className="display-face text-xl font-bold">Student Stage</Link><Button variant="ghost" onClick={() => logout()}><LogOut size={17} aria-hidden="true" />Log out</Button></div></header>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[13rem_1fr] lg:gap-16 lg:py-12">
        <aside aria-label="Student navigation" className="lg:border-r lg:pr-8"><p className="eyebrow text-xs font-semibold text-foreground/55">Workspace</p><nav className="mt-4 flex gap-2 overflow-x-auto lg:block lg:space-y-2"><Link to="/student" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><CircleUserRound size={17} aria-hidden="true" />Overview</Link><Link to="/student/questions" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><MessageCircleQuestion size={17} aria-hidden="true" />Questions</Link><Link to="/student/resources" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"><BookOpen size={17} aria-hidden="true" />Resources</Link><Link to="/student/profile" aria-current="page" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><CircleUserRound size={17} aria-hidden="true" />Profile</Link></nav></aside>
        <section className="page-enter min-w-0" aria-labelledby="profile-heading">
          <Link to="/student" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground/65 hover:text-foreground"><ArrowLeft size={17} aria-hidden="true" />Back to dashboard</Link>
          <div className="mt-8 border-b pb-8"><p className="eyebrow text-sm font-semibold text-success">Student profile</p><h1 id="profile-heading" className="display-face mt-4 text-4xl font-semibold sm:text-5xl">Make this space yours.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/65">Tell us what you study so Student Stage can eventually bring the most relevant questions and resources closer to you.</p></div>
          {isDemoSession && <div role="status" className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-5"><p className="eyebrow text-xs font-semibold text-warning">Demo mode</p><p className="mt-2 text-sm leading-6 text-foreground/70">Profile details are saved only in this browser for the frontend demo. They will later be stored through the existing profile API.</p></div>}
          <form onSubmit={saveProfile} className="mt-10 max-w-3xl rounded-lg border bg-surface p-5 sm:p-8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><CircleUserRound size={25} aria-hidden="true" /></div><div><h2 className="text-xl font-semibold">Your academic details</h2><p className="mt-1 text-sm leading-6 text-foreground/60">Faculty and department options match the student groups you shared.</p></div></div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="display-name" className="block text-sm font-medium">Display name</label><input id="display-name" value={profile.displayName} onChange={(event) => update("displayName", event.target.value)} placeholder="Your name" className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm" maxLength={60} /></div><div className="sm:col-span-2"><label htmlFor="faculty" className="block text-sm font-medium">Faculty</label><select id="faculty" value={profile.facultyId} onChange={(event) => update("facultyId", event.target.value)} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm"><option value="">Choose your faculty</option>{faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.shortName} — {faculty.name}</option>)}</select></div><div><label htmlFor="department" className="block text-sm font-medium">Department</label><select id="department" value={profile.department} onChange={(event) => update("department", event.target.value)} disabled={!selectedFaculty} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"><option value="">{selectedFaculty ? "Choose your department" : "Select a faculty first"}</option>{selectedFaculty?.departments.map((department) => <option key={department}>{department}</option>)}</select></div><div><label htmlFor="level" className="block text-sm font-medium">Level <span className="font-normal text-foreground/50">(optional)</span></label><select id="level" value={profile.level} onChange={(event) => update("level", event.target.value)} className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 text-sm"><option value="">Choose your level</option><option>100 level</option><option>200 level</option><option>300 level</option><option>400 level</option><option>500 level</option></select></div></div>
            <div className="mt-8 flex flex-wrap items-center gap-4"><Button type="submit">Save profile</Button>{saved && <p role="status" className="inline-flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 size={18} aria-hidden="true" />Saved in this browser</p>}</div>
          </form>
          <section className="mt-8 max-w-3xl rounded-lg border border-dashed bg-surface p-6"><FileText size={23} aria-hidden="true" /><h2 className="display-face mt-5 text-2xl font-semibold">What happens next?</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">Once the backend is available, these details will be sent to your existing profile endpoint. The dashboard, questions, and resources can then be filtered to your faculty and department.</p></section>
        </section>
      </div>
    </main>
  );
}
