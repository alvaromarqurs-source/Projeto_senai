type StepNavigationProps = {
  backLabel?: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  loading?: boolean;
};

export function StepNavigation({
  backLabel = "Sair",
  nextLabel,
  onBack,
  onNext,
  nextDisabled = false,
  loading = false,
}: StepNavigationProps) {
  return (
    <footer className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="inline-flex h-11 min-w-40 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {loading ? "Salvando..." : `${nextLabel} ->`}
      </button>
    </footer>
  );
}
