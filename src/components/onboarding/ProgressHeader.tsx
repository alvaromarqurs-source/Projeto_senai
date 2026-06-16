type ProgressHeaderProps = {
  currentStep: number;
  totalSteps: number;
  title: string;
  badge: string;
};

export function ProgressHeader({
  currentStep,
  totalSteps,
  title,
  badge,
}: ProgressHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <header className="mb-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-indigo-600">
            Passo {currentStep} de {totalSteps}
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-950">
            {title}
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {badge}
        </span>
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={`Progresso do onboarding: passo ${currentStep} de ${totalSteps}`}
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
