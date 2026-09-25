import { useCallback, useEffect, useMemo, useState } from "react";
import { courseApi } from "./api";
import { CourseCard } from "./components/CourseCard";
import { CourseForm } from "./components/CourseForm";
import { Modal } from "./components/Modal";
import { SiteNav } from "./components/SiteNav";
import type { Course, CourseInput, CourseStatus } from "./types";

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCourses(await courseApi.list());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCourses(); }, [loadCourses]);

  const stats = useMemo(() => {
    const byStatus: Record<CourseStatus, number> = { "Not Started": 0, "In Progress": 0, Completed: 0 };
    for (const course of courses) byStatus[course.status] += 1;
    return byStatus;
  }, [courses]);

  async function createCourse(input: CourseInput) {
    try {
      setSaving(true);
      setError(null);
      const created = await courseApi.create(input);
      setCourses((current) => [...current, created]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create course");
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  async function updateCourse(input: CourseInput) {
    if (!editing) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await courseApi.update(editing.id, input);
      setCourses((current) => current.map((course) => course.id === updated.id ? updated : course));
      setEditing(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update course");
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  async function deleteCourse(course: Course) {
    if (!window.confirm(`Delete “${course.name}”? This cannot be undone.`)) return;
    try {
      setError(null);
      await courseApi.remove(course.id);
      setCourses((current) => current.filter((item) => item.id !== course.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete course");
    }
  }

  const statCards: Array<[string, number, string]> = [
    ["Total courses", courses.length, "from-violet-600 to-indigo-600"],
    ["Not started", stats["Not Started"], "from-slate-500 to-slate-700"],
    ["In progress", stats["In Progress"], "from-amber-500 to-orange-500"],
    ["Completed", stats.Completed, "from-emerald-500 to-teal-600"],
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="overflow-hidden bg-slate-950 text-white">
        <SiteNav current="dashboard" />
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10">
          <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">Developer learning hub</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Build skills with intention.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">Plan your next course, stay focused, and see your learning momentum at a glance.</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-5 py-10">
        <section aria-label="Learning statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(([label, value, gradient]) => (
            <article key={label} className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}>
              <p className="text-sm font-semibold text-white/75">{label}</p>
              <p className="mt-2 text-4xl font-black">{value}</p>
            </article>
          ))}
        </section>

        {error ? <div role="alert" className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800"><span>{error}</span><button onClick={() => setError(null)} className="font-bold">Dismiss</button></div> : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">New goal</p>
            <h2 className="mt-1 text-2xl font-black">Add a course</h2>
          </div>
          <CourseForm onSubmit={createCourse} busy={saving} />
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-sm font-bold uppercase tracking-widest text-violet-600">Your roadmap</p><h2 className="mt-1 text-2xl font-black">Learning courses</h2></div>
            <button onClick={() => void loadCourses()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700">Refresh</button>
          </div>
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading courses…</div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center"><p className="text-4xl">📚</p><h3 className="mt-4 text-lg font-bold">No courses yet</h3><p className="mt-1 text-sm text-slate-500">Add your first learning goal above.</p></div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <CourseCard key={course.id} course={course} onEdit={setEditing} onDelete={(item) => void deleteCourse(item)} />)}</div>
          )}
        </section>
      </div>

      {editing ? <Modal title="Edit course" onClose={() => setEditing(null)}><CourseForm initialValue={editing} submitLabel="Save changes" busy={saving} onSubmit={updateCourse} onCancel={() => setEditing(null)} /></Modal> : null}
    </main>
  );
}
