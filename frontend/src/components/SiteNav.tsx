interface SiteNavProps {
  current: "dashboard" | "prompts";
}

export function SiteNav({ current }: SiteNavProps) {
  const linkClass = (active: boolean) => `rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;

  return (
    <nav aria-label="Primary navigation" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <a href="/" className="flex items-center gap-3 font-black tracking-tight text-white">
        <span className="grid size-9 place-items-center rounded-xl bg-violet-500 text-sm shadow-lg shadow-violet-950">CC</span>
        CodeCraftHub
      </a>
      <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
        <a href="/" aria-current={current === "dashboard" ? "page" : undefined} className={linkClass(current === "dashboard")}>Dashboard</a>
        <a href="/prompts" aria-current={current === "prompts" ? "page" : undefined} className={linkClass(current === "prompts")}>Prompt journey</a>
      </div>
    </nav>
  );
}
