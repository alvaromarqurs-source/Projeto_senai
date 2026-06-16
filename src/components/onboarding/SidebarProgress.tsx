import { Check, ShieldCheck } from "lucide-react";

export type OnboardingStep = {
  id: number;
  title: string;
  shortTitle: string;
};

type SidebarProgressProps = {
  steps: OnboardingStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
  canOpenStep: (step: number) => boolean;
};

function indicatorClassName(isActive: boolean, isDone: boolean) {
  if (isDone) {
    return "bg-emerald-500 text-white";
  }

  if (isActive) {
    return "bg-white text-indigo-700 ring-2 ring-indigo-600";
  }

  return "bg-slate-100 text-slate-400";
}

export function SidebarProgress({
  steps,
  currentStep,
  onStepClick,
  canOpenStep,
}: SidebarProgressProps) {
  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <div className="onboarding-stepper flex items-center justify-between gap-3 overflow-x-auto pb-1">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;
            const disabled = !canOpenStep(step.id);

            return (
              <button
                key={step.id}
                type="button"
                disabled={disabled}
                onClick={() => onStepClick(step.id)}
                className="group flex min-w-16 flex-col items-center gap-2 rounded-xl px-1 py-1 text-center transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${indicatorClassName(
                    isActive,
                    isDone,
                  )}`}
                >
                  {isDone ? <Check aria-hidden="true" className="h-4 w-4" /> : step.id}
                </span>
                <span className="text-[11px] font-bold leading-4 text-slate-600">
                  {step.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="hidden w-80 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex lg:min-h-[720px]">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            Perfil do Investidor
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-950">
            Onboarding da sua jornada financeira
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Responda algumas perguntas para personalizar sua experiência e deixar seu
            perfil pronto para a próxima etapa.
          </p>
        </div>

        <nav aria-label="Etapas do onboarding" className="mt-8 flex-1 space-y-3">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;
            const disabled = !canOpenStep(step.id);

            return (
              <button
                key={step.id}
                type="button"
                disabled={disabled}
                onClick={() => onStepClick(step.id)}
                aria-current={isActive ? "step" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-indigo-200 bg-indigo-50"
                    : "border-transparent bg-transparent hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${indicatorClassName(
                    isActive,
                    isDone,
                  )}`}
                >
                  {isDone ? <Check aria-hidden="true" className="h-4 w-4" /> : step.id}
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-950">{step.title}</span>
                  <span className="block text-xs text-slate-500">
                    Passo {step.id} de {steps.length}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <ShieldCheck aria-hidden="true" className="mb-2 h-5 w-5 text-slate-500" />
          <p className="text-sm font-bold text-slate-950">Ambiente seguro</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Seus dados são usados apenas para montar seu perfil inicial e orientar a
            conversa com mais precisão.
          </p>
        </div>
      </aside>
    </>
  );
}
