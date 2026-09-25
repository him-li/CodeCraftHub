import { useEffect, useState, type FormEvent } from "react";
import { COURSE_STATUSES, type CourseInput } from "../types";
import { useLanguage } from "../i18n";

const EMPTY_COURSE: CourseInput = { name: "", description: "", target_date: "", status: "Not Started" };

interface CourseFormProps {
  initialValue?: CourseInput;
  submitLabel?: string;
  busy?: boolean;
  onSubmit: (course: CourseInput) => Promise<void>;
  onCancel?: () => void;
}

export function CourseForm({ initialValue = EMPTY_COURSE, submitLabel, busy = false, onSubmit, onCancel }: CourseFormProps) {
  const { t } = useLanguage();
  const [course, setCourse] = useState<CourseInput>(initialValue);
  useEffect(() => setCourse(initialValue), [initialValue]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ ...course, name: course.name.trim(), description: course.description.trim() });
    if (!onCancel) setCourse(EMPTY_COURSE);
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";
  const prefix = onCancel ? "edit-" : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor={`${prefix}name`} className="text-sm font-semibold text-slate-700">{t.form.name}</label>
        <input id={`${prefix}name`} className={inputClass} required value={course.name} onChange={(event) => setCourse((current) => ({ ...current, name: event.target.value }))} placeholder={t.form.namePlaceholder} />
      </div>
      <div>
        <label htmlFor={`${prefix}description`} className="text-sm font-semibold text-slate-700">{t.form.description}</label>
        <textarea id={`${prefix}description`} className={`${inputClass} min-h-24 resize-y`} required value={course.description} onChange={(event) => setCourse((current) => ({ ...current, description: event.target.value }))} placeholder={t.form.descriptionPlaceholder} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${prefix}target-date`} className="text-sm font-semibold text-slate-700">{t.form.targetDate}</label>
          <input id={`${prefix}target-date`} type="date" className={inputClass} required value={course.target_date} onChange={(event) => setCourse((current) => ({ ...current, target_date: event.target.value }))} />
        </div>
        <div>
          <label htmlFor={`${prefix}status`} className="text-sm font-semibold text-slate-700">{t.form.status}</label>
          <select id={`${prefix}status`} className={inputClass} value={course.status} onChange={(event) => setCourse((current) => ({ ...current, status: event.target.value as CourseInput["status"] }))}>
            {COURSE_STATUSES.map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        {onCancel ? <button type="button" onClick={onCancel} className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">{t.form.cancel}</button> : null}
        <button disabled={busy} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? t.form.saving : (submitLabel ?? t.form.add)}
        </button>
      </div>
    </form>
  );
}
