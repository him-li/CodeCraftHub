import { LOCALES, useLanguage, type Locale } from "../i18n";

interface SiteNavProps {
  current: "dashboard" | "prompts";
}

export function SiteNav({ current }: SiteNavProps) {
  const { locale, setLocale, t } = useLanguage();
  const linkClass = (active: boolean) => `rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;

  return (
    <nav aria-label="Primary navigation" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <a href="/" className="flex items-center gap-3 font-black tracking-tight text-white">
        <span className="grid size-9 place-items-center rounded-xl bg-violet-500 text-sm shadow-lg shadow-violet-950">CC</span>
        CodeCraftHub
      </a>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
          <a href="/" aria-current={current === "dashboard" ? "page" : undefined} className={linkClass(current === "dashboard")}>{t.nav.dashboard}</a>
          <a href="/prompts" aria-current={current === "prompts" ? "page" : undefined} className={linkClass(current === "prompts")}>{t.nav.prompts}</a>
        </div>
        <label className="sr-only" htmlFor="language-select">{t.nav.language}</label>
        <select id="language-select" aria-label={t.nav.language} value={locale} onChange={(event) => setLocale(event.target.value as Locale)} className="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-violet-400">
          {LOCALES.map((item) => <option key={item} value={item}>{item === "en" ? "English" : item === "zh-CN" ? "简体中文" : item === "zh-TW" ? "繁體中文" : item === "he" ? "עברית" : "العربية"}</option>)}
        </select>
      </div>
    </nav>
  );
}
