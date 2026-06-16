import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

type GoalCardProps = {
  title: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: () => void;
};

export function GoalCard({ title, icon: Icon, selected, onSelect }: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex min-h-28 flex-col items-center justify-center rounded-xl border bg-white p-4 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100"
          : "border-slate-200"
      }`}
    >
      {selected && (
        <CheckCircle2
          aria-hidden="true"
          className="absolute right-3 top-3 h-5 w-5 fill-indigo-600 text-indigo-600"
        />
      )}
      <Icon aria-hidden="true" className="h-8 w-8 text-indigo-600" strokeWidth={1.8} />
      <span className="mt-3 text-sm font-bold leading-5 text-slate-950">{title}</span>
    </button>
  );
}
