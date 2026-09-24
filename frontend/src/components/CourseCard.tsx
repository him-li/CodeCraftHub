import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const statusStyles: Record<Course["status"], string> = {
  "Not Started": "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
};

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${course.target_date}T00:00:00Z`));
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[course.status]}`}>{course.status}</span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{course.description}</p>
      <p className="mt-5 text-sm font-medium text-slate-500">Target: <time dateTime={course.target_date}>{formattedDate}</time></p>
      <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
        <button onClick={() => onEdit(course)} className="rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">Edit</button>
        <button onClick={() => onDelete(course)} className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
      </div>
    </article>
  );
}
