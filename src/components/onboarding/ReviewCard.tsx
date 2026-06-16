import * as React from "react";
import { ChevronDown } from "lucide-react";

type ReviewCardProps = {
  title: string;
  summary: string;
  children?: React.ReactNode;
  onEdit: () => void;
};

export function ReviewCard({ title, summary, children, onEdit }: ReviewCardProps) {
  const [open, setOpen] = React.useState(false);
  const contentId = React.useId();

  return (
    <article className="rounded-xl border border-slate-200 bg-white transition hover:border-indigo-100">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={contentId}
          className="rounded-md text-slate-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          />
          <span className="sr-only">Expandir {title}</span>
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-950">{title}</h3>
          <p className="mt-1 truncate text-xs leading-5 text-slate-500">{summary}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Editar
        </button>
      </div>
      {open && (
        <div id={contentId} className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
          {children}
        </div>
      )}
    </article>
  );
}
