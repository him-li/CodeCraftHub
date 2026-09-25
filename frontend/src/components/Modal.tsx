import { useEffect, type ReactNode } from "react";
import { useLanguage } from "../i18n";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  const { t } = useLanguage();
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label={t.modal.close} className="grid size-10 place-items-center rounded-full text-xl text-slate-500 hover:bg-slate-100">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
