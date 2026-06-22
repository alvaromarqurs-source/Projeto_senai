import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ChevronDown,
  CircleDollarSign,
  GraduationCap,
  Goal,
  Home,
  PartyPopper,
  Plane,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  Umbrella,
  WalletCards,
} from "lucide-react";

import { GoalCard } from "./src/components/onboarding/GoalCard";
import { InfoCard } from "./src/components/onboarding/InfoCard";
import { ProgressHeader } from "./src/components/onboarding/ProgressHeader";
import { ReviewCard } from "./src/components/onboarding/ReviewCard";
import {
  OnboardingStep,
  SidebarProgress,
} from "./src/components/onboarding/SidebarProgress";
import { StepNavigation } from "./src/components/onboarding/StepNavigation";
import { SuccessCard } from "./src/components/onboarding/SuccessCard";
import { createClient, type Client } from "./src/services/clientService";

type PersonalData = {
  nome: string;
  cpf: string;
  email: string;
  idade: string;
  rendaAtual: string;
  dor: string;
};

type FinancialData = {
  investimentoMensal: string;
  reservaEmergencia: "sim" | "nao" | "";
  valorReserva: string;
  possuiDividas: "sim" | "nao" | "";
  rendaComprometida: number;
};

type GoalData = {
  objetivo: "aposentadoria" | "imovel" | "viajar" | "renda" | "";
  prazo: number;
  metaFinanceira: string;
  preocupacao: string;
};

export interface PerfilInvestidor {
  liquidezNecessaria: string;
  aceitacaoPerdaPercentual: number;
  experienciaInvestimentos: string;
  toleranciaVolatilidade: string;
  objetivoVida: string;
}

type OnboardingData = {
  personal: PersonalData;
  financial: FinancialData;
  goals: GoalData;
  perfilInvestidor: PerfilInvestidor;
};

type FieldError = Partial<Record<string, string>>;

const storageKey = "investor-onboarding-data";
const maxStepKey = "investor-onboarding-max-step";
const totalSteps = 6;

const steps: OnboardingStep[] = [
  { id: 1, title: "Informações pessoais", shortTitle: "Info. pessoais" },
  { id: 2, title: "Situação financeira", shortTitle: "Sit. financeira" },
  { id: 3, title: "Objetivos", shortTitle: "Objetivos" },
  { id: 4, title: "Perfil do Investidor", shortTitle: "Perfil" },
  { id: 5, title: "Revisão", shortTitle: "Revisão" },
  { id: 6, title: "Conclusão", shortTitle: "Conclusão" },
];

const initialData: OnboardingData = {
  personal: {
    nome: "",
    cpf: "",
    email: "",
    idade: "",
    rendaAtual: "",
    dor: "",
  },
  financial: {
    investimentoMensal: "",
    reservaEmergencia: "",
    valorReserva: "",
    possuiDividas: "",
    rendaComprometida: 40,
  },
  goals: {
    objetivo: "",
    prazo: 10,
    metaFinanceira: "",
    preocupacao: "",
  },
  perfilInvestidor: {
    liquidezNecessaria: "",
    aceitacaoPerdaPercentual: 0,
    experienciaInvestimentos: "",
    toleranciaVolatilidade: "",
    objetivoVida: "",
  },
};

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

const selectClassName =
  "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

const labelClassName = "mb-2 block text-sm font-bold text-slate-950";

function getInitialStep() {
  const match = window.location.pathname.match(/\/onboarding\/step-(\d)/);
  if (!match) return 1;
  return Math.min(Math.max(Number(match[1]), 1), totalSteps);
}

function readStoredData(): OnboardingData {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return initialData;
    const parsed = JSON.parse(stored) as Partial<OnboardingData>;
    return {
      personal: { ...initialData.personal, ...parsed.personal },
      financial: { ...initialData.financial, ...parsed.financial },
      goals: { ...initialData.goals, ...parsed.goals },
      perfilInvestidor: {
        ...initialData.perfilInvestidor,
        ...parsed.perfilInvestidor,
      },
    };
  } catch {
    return initialData;
  }
}

function formatCurrency(value: string) {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  const amount = Number(numbers) / 100;
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseMoney(value: string) {
  return Number(value.replace(/\D/g, "")) / 100;
}

function toDecimalString(value: string) {
  return parseMoney(value).toFixed(2);
}

function mapOnboardingToClient(data: OnboardingData): Client {
  return {
    dadosPessoais: {
      nome: data.personal.nome.trim(),
      cpf: data.personal.cpf.replace(/\D/g, ""),
      email: data.personal.email.trim(),
      idade: Number(data.personal.idade),
      rendaAtual: toDecimalString(data.personal.rendaAtual),
      dor: data.personal.dor.trim(),
    },
    situacaoFinanceira: {
      aporteMensal: toDecimalString(data.financial.investimentoMensal),
      reservaDeEmergencia: data.financial.reservaEmergencia === "sim",
      valorReservaEmergencia: toDecimalString(data.financial.valorReserva),
      possuiDividas: data.financial.possuiDividas === "sim",
      rendaComprometida: data.financial.rendaComprometida,
    },
    objetivos: {
      objetivo: data.goals.objetivo,
      prazo: data.goals.prazo,
      metaFinanceira: toDecimalString(data.goals.metaFinanceira),
      preocupacao: data.goals.preocupacao.trim(),
    },
    perfilInvestidor: { ...data.perfilInvestidor },
  };
}

function goalLabel(goal: GoalData["objetivo"]) {
  const labels = {
    aposentadoria: "Aposentadoria",
    imovel: "Comprar imóvel",
    viajar: "Viajar",
    renda: "Renda passiva",
    "": "Não informado",
  };
  return labels[goal];
}

function validateStep(step: number, data: OnboardingData): FieldError {
  const errors: FieldError = {};

  if (step === 1) {
    if (!data.personal.nome.trim()) errors.nome = "Informe seu nome.";
    if (data.personal.cpf.replace(/\D/g, "").length < 11) errors.cpf = "CPF incompleto.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email)) {
      errors.email = "Informe um e-mail válido.";
    }
    if (!data.personal.idade || Number(data.personal.idade) < 18) {
      errors.idade = "Idade mínima de 18 anos.";
    }
    if (parseMoney(data.personal.rendaAtual) <= 0) errors.rendaAtual = "Informe sua renda.";
    if (!data.personal.dor.trim()) errors.dor = "Conte sua principal dificuldade.";
  }

  if (step === 2) {
    if (parseMoney(data.financial.investimentoMensal) <= 0) {
      errors.investimentoMensal = "Escolha quanto pode investir.";
    }
    if (!data.financial.reservaEmergencia) errors.reservaEmergencia = "Selecione uma opção.";
    if (data.financial.reservaEmergencia === "sim" && parseMoney(data.financial.valorReserva) <= 0) {
      errors.valorReserva = "Informe o valor da reserva.";
    }
    if (!data.financial.possuiDividas) errors.possuiDividas = "Selecione uma opção.";
  }

  if (step === 3) {
    if (!data.goals.objetivo) errors.objetivo = "Selecione um objetivo.";
    if (parseMoney(data.goals.metaFinanceira) <= 0) errors.metaFinanceira = "Informe uma meta.";
    if (!data.goals.preocupacao.trim()) errors.preocupacao = "Preencha este campo.";
  }

  if (step === 4) {
    if (!data.perfilInvestidor.liquidezNecessaria) {
      errors.liquidezNecessaria = "Selecione uma opção.";
    }
    if (!data.perfilInvestidor.experienciaInvestimentos) {
      errors.experienciaInvestimentos = "Selecione uma opção.";
    }
    if (!data.perfilInvestidor.toleranciaVolatilidade) {
      errors.toleranciaVolatilidade = "Selecione uma opção.";
    }
    if (!data.perfilInvestidor.objetivoVida) {
      errors.objetivoVida = "Selecione uma opção.";
    }
  }

  return errors;
}

function hasErrors(errors: FieldError) {
  return Object.keys(errors).length > 0;
}

function FieldErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="mt-2 text-xs font-bold text-rose-600" role="alert">
      {error}
    </p>
  );
}

function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(formatCurrency(event.target.value))}
        placeholder={placeholder}
        inputMode="decimal"
        className={inputClassName}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <FieldErrorText error={error} />
    </div>
  );
}

function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClassName}
        aria-invalid={Boolean(error)}
      />
      <FieldErrorText error={error} />
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        aria-invalid={Boolean(error)}
      />
      <FieldErrorText error={error} />
    </div>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-4" role="radiogroup" aria-label={name}>
        {options.map((option) => (
          <label key={option.value} className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">{option.label}</span>
          </label>
        ))}
      </div>
      <FieldErrorText error={error} />
    </div>
  );
}

function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione uma faixa de valor",
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={selectClassName}
          aria-invalid={Boolean(error)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
      </div>
      <FieldErrorText error={error} />
    </div>
  );
}

function RangeInput({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  leftLabel,
  rightLabel,
  valueLabel,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
  valueLabel: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{leftLabel}</span>
        <span className="font-bold text-slate-800">{valueLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      />
    </div>
  );
}

export default function InvestorProfileOnboarding() {
  const [data, setData] = React.useState<OnboardingData>(() => readStoredData());
  const [currentStep, setCurrentStep] = React.useState(() => getInitialStep());
  const [maxUnlockedStep, setMaxUnlockedStep] = React.useState(() => {
    const stored = Number(window.localStorage.getItem(maxStepKey));
    return Math.max(stored > 0 ? stored : 1, getInitialStep());
  });
  const [errors, setErrors] = React.useState<FieldError>({});
  const [validationVisible, setValidationVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  React.useEffect(() => {
    window.localStorage.setItem(maxStepKey, String(maxUnlockedStep));
  }, [maxUnlockedStep]);

  React.useEffect(() => {
    const onPopState = () => setCurrentStep(getInitialStep());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  React.useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (currentStep < totalSteps) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [currentStep]);

  React.useEffect(() => {
    setValidationVisible(false);
    setErrors({});
    setSubmitError(null);
  }, [currentStep]);

  React.useEffect(() => {
    if (validationVisible) {
      setErrors(validateStep(currentStep, data));
    }
  }, [currentStep, data, validationVisible]);

  function updateData<T extends keyof OnboardingData>(
    section: T,
    value: Partial<OnboardingData[T]>,
  ) {
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...value,
      },
    }));
  }

  function goToStep(step: number) {
    const target = Math.min(Math.max(step, 1), totalSteps);
    setCurrentStep(target);
    const path = target === 1 ? "/" : `/onboarding/step-${target}`;
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function canOpenStep(step: number) {
    return step <= maxUnlockedStep;
  }

  async function handleNext() {
    const nextErrors = validateStep(currentStep, data);
    setErrors(nextErrors);
    setValidationVisible(true);
    if (hasErrors(nextErrors)) return;

    setLoading(true);
    setSubmitError(null);

    if (currentStep === 5) {
      try {
        await createClient(mapOnboardingToClient(data));
        const nextStep = Math.min(currentStep + 1, totalSteps);
        setMaxUnlockedStep((current) => Math.max(current, nextStep));
        goToStep(nextStep);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o cadastro. Tente novamente.",
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    window.setTimeout(() => {
      setLoading(false);
      const nextStep = Math.min(currentStep + 1, totalSteps);
      setMaxUnlockedStep((current) => Math.max(current, nextStep));
      goToStep(nextStep);
    }, 350);
  }

  function handleBack() {
    if (currentStep === 1) {
      const shouldReset = window.confirm(
        "Seus dados estão salvos neste navegador. Deseja sair e manter o progresso?",
      );
      if (shouldReset) goToStep(1);
      return;
    }
    goToStep(currentStep - 1);
  }

  const stepContent = {
    1: (
      <StepOne
        data={data.personal}
        errors={errors}
        onChange={(value) => updateData("personal", value)}
        onBack={handleBack}
        onNext={handleNext}
        loading={loading}
        isValid={!hasErrors(validateStep(1, data))}
      />
    ),
    2: (
      <StepTwo
        data={data.financial}
        errors={errors}
        onChange={(value) => updateData("financial", value)}
        onBack={handleBack}
        onNext={handleNext}
        loading={loading}
        isValid={!hasErrors(validateStep(2, data))}
      />
    ),
    3: (
      <StepThree
        data={data.goals}
        errors={errors}
        onChange={(value) => updateData("goals", value)}
        onBack={handleBack}
        onNext={handleNext}
        loading={loading}
        isValid={!hasErrors(validateStep(3, data))}
      />
    ),
    4: (
      <StepFour
        data={data.perfilInvestidor}
        errors={errors}
        onChange={(value) => updateData("perfilInvestidor", value)}
        onBack={handleBack}
        onNext={handleNext}
        loading={loading}
      />
    ),
    5: (
      <StepFive
        data={data}
        onEdit={goToStep}
        onBack={handleBack}
        onNext={handleNext}
        loading={loading}
        submitError={submitError}
      />
    ),
    6: <StepSix data={data} onBack={() => goToStep(1)} />,
  }[currentStep];

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-950 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:gap-6">
        <SidebarProgress
          steps={steps}
          currentStep={currentStep}
          canOpenStep={canOpenStep}
          onStepClick={(step) => {
            if (canOpenStep(step)) goToStep(step);
          }}
        />

        <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          <div className="animate-[fadeIn_220ms_ease-out]">{stepContent}</div>
        </section>
      </div>
    </main>
  );
}

function StepOne({
  data,
  errors,
  onChange,
  onBack,
  onNext,
  loading,
  isValid,
}: {
  data: PersonalData;
  errors: FieldError;
  onChange: (value: Partial<PersonalData>) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
  isValid: boolean;
}) {
  return (
    <>
      <ProgressHeader currentStep={1} totalSteps={totalSteps} title="Informações pessoais" badge="6 campos" />
      <div className="space-y-5">
        <TextInput id="nome" label="Nome do usuário" value={data.nome} onChange={(nome) => onChange({ nome })} placeholder="Digite seu nome completo" error={errors.nome} />
        <TextInput id="cpf" label="CPF" value={data.cpf} onChange={(cpf) => onChange({ cpf })} placeholder="000.000.000-00" error={errors.cpf} />
        <TextInput id="email" label="Gmail" value={data.email} onChange={(email) => onChange({ email })} placeholder="seuemail@gmail.com" type="email" error={errors.email} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput id="idade" label="Idade" value={data.idade} onChange={(idade) => onChange({ idade })} placeholder="Ex.: 30" type="number" error={errors.idade} />
          <CurrencyInput id="rendaAtual" label="Renda atual" value={data.rendaAtual} onChange={(rendaAtual) => onChange({ rendaAtual })} placeholder="Ex.: R$ 5.000,00" error={errors.rendaAtual} />
        </div>
        <TextArea id="dor" label="Dor" value={data.dor} onChange={(dor) => onChange({ dor })} placeholder="Qual sua maior dificuldade financeira hoje?" error={errors.dor} />
        {isValid && (
          <SuccessCard>Esses dados ajudam a definir uma estratégia compatível com sua realidade financeira.</SuccessCard>
        )}
        <InfoCard>
          Essas informações ajudam a entender sua realidade financeira e criar uma experiência inicial coerente com seu momento de vida.
        </InfoCard>
        <StepNavigation onBack={onBack} onNext={onNext} nextLabel="Continuar" loading={loading} />
      </div>
    </>
  );
}

function StepTwo({
  data,
  errors,
  onChange,
  onBack,
  onNext,
  loading,
  isValid,
}: {
  data: FinancialData;
  errors: FieldError;
  onChange: (value: Partial<FinancialData>) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
  isValid: boolean;
}) {
  return (
    <>
      <ProgressHeader currentStep={2} totalSteps={totalSteps} title="Situação financeira" badge="5 campos" />
      <div className="space-y-5">
        <SelectInput
          id="investimentoMensal"
          label="Quanto você consegue investir por mês?"
          value={data.investimentoMensal}
          onChange={(investimentoMensal) => onChange({ investimentoMensal })}
          options={["R$ 100,00", "R$ 250,00", "R$ 500,00", "R$ 1.000,00", "Acima de R$ 2.000,00"]}
          error={errors.investimentoMensal}
        />
        <div>
          <p className={labelClassName}>Possui reserva de emergência?</p>
          <RadioGroup name="reserva" value={data.reservaEmergencia} onChange={(reservaEmergencia) => onChange({ reservaEmergencia: reservaEmergencia as FinancialData["reservaEmergencia"] })} options={[{ label: "Sim", value: "sim" }, { label: "Não", value: "nao" }]} error={errors.reservaEmergencia} />
        </div>
        <CurrencyInput id="valorReserva" label="Valor da reserva" value={data.valorReserva} onChange={(valorReserva) => onChange({ valorReserva })} placeholder="R$ 15.000" error={errors.valorReserva} />
        <div>
          <p className={labelClassName}>Possui dívidas atualmente?</p>
          <RadioGroup name="dividas" value={data.possuiDividas} onChange={(possuiDividas) => onChange({ possuiDividas: possuiDividas as FinancialData["possuiDividas"] })} options={[{ label: "Sim", value: "sim" }, { label: "Não", value: "nao" }]} error={errors.possuiDividas} />
        </div>
        <RangeInput id="rendaComprometida" label="Qual percentual da sua renda está comprometido?" value={data.rendaComprometida} min={0} max={100} step={5} onChange={(rendaComprometida) => onChange({ rendaComprometida })} leftLabel="0%" rightLabel="100%" valueLabel={`${data.rendaComprometida}%`} />
        {isValid && (
          <SuccessCard>Esses dados ajudam a definir uma estratégia compatível com sua realidade financeira.</SuccessCard>
        )}
        <InfoCard>
          Entender sua situação financeira nos ajuda a sugerir investimentos alinhados com sua capacidade e objetivos.
        </InfoCard>
        <StepNavigation onBack={onBack} onNext={onNext} nextLabel="Continuar" loading={loading} />
      </div>
    </>
  );
}

function StepThree({
  data,
  errors,
  onChange,
  onBack,
  onNext,
  loading,
  isValid,
}: {
  data: GoalData;
  errors: FieldError;
  onChange: (value: Partial<GoalData>) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
  isValid: boolean;
}) {
  const goals = [
    { value: "aposentadoria" as const, title: "Aposentar", icon: Umbrella },
    { value: "imovel" as const, title: "Comprar imóvel", icon: Home },
    { value: "viajar" as const, title: "Viajar", icon: Plane },
    { value: "renda" as const, title: "Renda passiva", icon: CircleDollarSign },
  ];

  return (
    <>
      <ProgressHeader currentStep={3} totalSteps={totalSteps} title="Objetivos" badge="4 campos" />
      <div className="space-y-5">
        <div>
          <p className={labelClassName}>Qual seu principal objetivo?</p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {goals.map((goal) => (
              <GoalCard key={goal.value} title={goal.title} icon={goal.icon} selected={data.objetivo === goal.value} onSelect={() => onChange({ objetivo: goal.value })} />
            ))}
          </div>
          <FieldErrorText error={errors.objetivo} />
        </div>
        <RangeInput id="prazo" label="Em quanto tempo pretende alcançar?" value={data.prazo} min={1} max={30} onChange={(prazo) => onChange({ prazo })} leftLabel="1 ano" rightLabel="30 anos" valueLabel={`${data.prazo} anos`} />
        <CurrencyInput id="metaFinanceira" label="Quanto deseja acumular?" value={data.metaFinanceira} onChange={(metaFinanceira) => onChange({ metaFinanceira })} placeholder="R$ 500.000" error={errors.metaFinanceira} />
        <TextArea id="preocupacao" label="O que mais te preocupa hoje?" value={data.preocupacao} onChange={(preocupacao) => onChange({ preocupacao })} placeholder='Ex.: "Não saber se estou investindo corretamente."' error={errors.preocupacao} />
        {data.objetivo && isValid && (
          <SuccessCard title="Perfil compatível encontrado!">Continuaremos personalizando sua estratégia.</SuccessCard>
        )}
        <InfoCard>
          Essas informações nos ajudam a entender seus sonhos e criar um plano realista para conquistá-los.
        </InfoCard>
        <StepNavigation onBack={onBack} onNext={onNext} nextLabel="Continuar" loading={loading} />
      </div>
    </>
  );
}

function StepFour({
  data,
  errors,
  onChange,
  onBack,
  onNext,
  loading,
}: {
  data: PerfilInvestidor;
  errors: FieldError;
  onChange: (value: Partial<PerfilInvestidor>) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
}) {
  const toleranceOptions = [
    { value: "evitar_oscilacoes", title: "A) Prefiro evitar oscilações.", icon: Shield },
    { value: "pequenas_oscilacoes", title: "B) Aceito pequenas oscilações.", icon: BarChart3 },
    { value: "oscilacoes_moderadas", title: "C) Aceito oscilações moderadas.", icon: TrendingUp },
    {
      value: "grandes_oscilacoes",
      title: "D) Aceito grandes oscilações em busca de maiores retornos.",
      icon: Rocket,
    },
  ];

  const lifeGoalOptions = [
    { value: "aposentadoria", title: "Aposentadoria", icon: Umbrella },
    { value: "compra_imovel", title: "Compra de imóvel", icon: Home },
    { value: "independencia_financeira", title: "Independência financeira", icon: Goal },
    { value: "renda_passiva", title: "Renda passiva", icon: CircleDollarSign },
    { value: "educacao", title: "Educação", icon: GraduationCap },
    { value: "protecao_patrimonial", title: "Proteção patrimonial", icon: Building2 },
    { value: "viagens", title: "Viagens", icon: Plane },
    { value: "empreender", title: "Empreender", icon: BriefcaseBusiness },
  ];

  return (
    <>
      <ProgressHeader
        currentStep={4}
        totalSteps={totalSteps}
        title="Perfil do Investidor"
        badge="5 campos"
      />
      <div className="space-y-5">
        <SelectInput
          id="liquidezNecessaria"
          label="Em quanto tempo você pode precisar resgatar parte do dinheiro investido?"
          value={data.liquidezNecessaria}
          onChange={(liquidezNecessaria) => onChange({ liquidezNecessaria })}
          options={[
            "Menos de 6 meses",
            "Entre 6 meses e 1 ano",
            "Entre 1 e 3 anos",
            "Entre 3 e 5 anos",
            "Mais de 5 anos",
          ]}
          placeholder="Selecione um prazo"
          error={errors.liquidezNecessaria}
        />

        <RangeInput
          id="aceitacaoPerdaPercentual"
          label="Qual queda temporária você aceitaria em seus investimentos sem resgatar o dinheiro?"
          value={data.aceitacaoPerdaPercentual}
          min={0}
          max={50}
          step={1}
          onChange={(aceitacaoPerdaPercentual) => onChange({ aceitacaoPerdaPercentual })}
          leftLabel="0%"
          rightLabel="50%"
          valueLabel={`${data.aceitacaoPerdaPercentual}%`}
        />

        <div>
          <p className={labelClassName}>Qual é seu nível de experiência com investimentos?</p>
          <RadioGroup
            name="experienciaInvestimentos"
            value={data.experienciaInvestimentos}
            onChange={(experienciaInvestimentos) => onChange({ experienciaInvestimentos })}
            options={[
              { label: "Nenhuma", value: "nenhuma" },
              { label: "Básica", value: "basica" },
              { label: "Intermediária", value: "intermediaria" },
              { label: "Avançada", value: "avancada" },
            ]}
            error={errors.experienciaInvestimentos}
          />
        </div>

        <div>
          <p className={labelClassName}>
            Como você reage quando seus investimentos apresentam oscilações negativas?
          </p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {toleranceOptions.map((option) => (
              <GoalCard
                key={option.value}
                title={option.title}
                icon={option.icon}
                selected={data.toleranciaVolatilidade === option.value}
                onSelect={() => onChange({ toleranciaVolatilidade: option.value })}
              />
            ))}
          </div>
          <FieldErrorText error={errors.toleranciaVolatilidade} />
        </div>

        <div>
          <p className={labelClassName}>
            Qual objetivo melhor representa sua prioridade financeira atual?
          </p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {lifeGoalOptions.map((option) => (
              <GoalCard
                key={option.value}
                title={option.title}
                icon={option.icon}
                selected={data.objetivoVida === option.value}
                onSelect={() => onChange({ objetivoVida: option.value })}
              />
            ))}
          </div>
          <FieldErrorText error={errors.objetivoVida} />
        </div>

        <InfoCard>
          Suas respostas serão registradas para personalizar recomendações financeiras futuras.
        </InfoCard>
        <StepNavigation
          onBack={onBack}
          onNext={onNext}
          nextLabel="Continuar"
          loading={loading}
        />
      </div>
    </>
  );
}

function investorProfileLabel(value: string) {
  const labels: Record<string, string> = {
    nenhuma: "Nenhuma",
    basica: "Básica",
    intermediaria: "Intermediária",
    avancada: "Avançada",
    evitar_oscilacoes: "Prefiro evitar oscilações",
    pequenas_oscilacoes: "Aceito pequenas oscilações",
    oscilacoes_moderadas: "Aceito oscilações moderadas",
    grandes_oscilacoes: "Aceito grandes oscilações em busca de maiores retornos",
    aposentadoria: "Aposentadoria",
    compra_imovel: "Compra de imóvel",
    independencia_financeira: "Independência financeira",
    renda_passiva: "Renda passiva",
    educacao: "Educação",
    protecao_patrimonial: "Proteção patrimonial",
    viagens: "Viagens",
    empreender: "Empreender",
  };

  return labels[value] ?? "Não informado";
}

function StepFive({
  data,
  onEdit,
  onBack,
  onNext,
  loading,
  submitError,
}: {
  data: OnboardingData;
  onEdit: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
  submitError: string | null;
}) {
  return (
    <>
      <ProgressHeader currentStep={5} totalSteps={totalSteps} title="Revisão" badge="Revise seus dados" />
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-500">Revise suas informações antes de finalizar seu perfil.</p>
        <ReviewCard title="Informações pessoais" summary={`Nome: ${data.personal.nome || "Não informado"} • Idade: ${data.personal.idade || "--"} • Email: ${data.personal.email || "--"}`} onEdit={() => onEdit(1)}>
          Renda atual: {data.personal.rendaAtual || "Não informado"} • Dor: {data.personal.dor || "Não informado"}
        </ReviewCard>
        <ReviewCard title="Situação financeira" summary={`Investimento mensal: ${data.financial.investimentoMensal || "--"} • Reserva: ${data.financial.valorReserva || "Não informada"} • Dívidas: ${data.financial.possuiDividas || "--"}`} onEdit={() => onEdit(2)}>
          Renda comprometida: {data.financial.rendaComprometida}% • Reserva de emergência: {data.financial.reservaEmergencia || "Não informado"}
        </ReviewCard>
        <ReviewCard title="Objetivos" summary={`Objetivo: ${goalLabel(data.goals.objetivo)} • Prazo: ${data.goals.prazo} anos • Meta: ${data.goals.metaFinanceira || "--"}`} onEdit={() => onEdit(3)}>
          Preocupação: {data.goals.preocupacao || "Não informado"}
        </ReviewCard>
        <ReviewCard
          title="Perfil do Investidor"
          summary={`Liquidez: ${data.perfilInvestidor.liquidezNecessaria || "--"} • Aceitação de perda: ${data.perfilInvestidor.aceitacaoPerdaPercentual}% • Experiência: ${investorProfileLabel(data.perfilInvestidor.experienciaInvestimentos)}`}
          onEdit={() => onEdit(4)}
        >
          Tolerância à volatilidade: {investorProfileLabel(data.perfilInvestidor.toleranciaVolatilidade)} • Objetivo de vida: {investorProfileLabel(data.perfilInvestidor.objetivoVida)}
        </ReviewCard>
        <SuccessCard title="Tudo certo!">
          Confira se todas as informações estão corretas. Você poderá editar qualquer item antes de finalizar.
        </SuccessCard>
        {submitError && (
          <aside
            aria-live="assertive"
            className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700"
          >
            <p className="text-sm font-bold text-rose-800">Erro ao cadastrar cliente</p>
            <p className="mt-1 text-sm leading-6">{submitError}</p>
          </aside>
        )}
        <StepNavigation onBack={onBack} onNext={onNext} nextLabel="Gerar meu plano financeiro" loading={loading} />
      </div>
    </>
  );
}

function StepSix({ data, onBack }: { data: OnboardingData; onBack: () => void }) {
  const nextSteps = ["Perfil criado", "Dados analisados", "Montagem da estratégia", "Recomendações personalizadas"];

  return (
    <>
      <ProgressHeader currentStep={6} totalSteps={totalSteps} title="Conclusão" badge="100%" />
      <div className="space-y-6">
        <section className="text-center">
          <PartyPopper aria-hidden="true" className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-3 text-3xl font-bold text-indigo-600">Parabéns!</h2>
          <p className="mt-2 text-sm font-bold text-indigo-600">Seu perfil foi criado com sucesso.</p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Seu perfil foi registrado e será utilizado para personalizar suas recomendações financeiras.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryTile icon={WalletCards} label="Usuário" value={data.personal.nome || "Não informado"} />
          <SummaryTile icon={Target} label="Objetivo principal" value={goalLabel(data.goals.objetivo)} />
          <SummaryTile icon={CircleDollarSign} label="Investimento mensal" value={data.financial.investimentoMensal || "Não informado"} />
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold text-slate-950">Próximos passos</h3>
          <ol className="space-y-3">
            {nextSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm text-slate-600">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${index < 2 ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-slate-400"}`}>
                  {index < 2 ? "✓" : ""}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <FeatureTile icon={BarChart3} title="Plano personalizado" text="Uma estratégia feita para seus objetivos e perfil." />
          <FeatureTile icon={Goal} title="Recomendações" text="Sugestões de investimentos alinhadas ao seu perfil." />
          <FeatureTile icon={CalendarClock} title="Acompanhamento" text="Acompanhe sua evolução de forma contínua." />
        </section>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
          <button type="button" onClick={onBack} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Voltar ao dashboard
          </button>
          <button type="button" className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Ver meu plano &gt;
          </button>
        </div>
      </div>
    </>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 text-center">
      <Icon aria-hidden="true" className="mx-auto h-7 w-7 text-indigo-600" />
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </article>
  );
}

function FeatureTile({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-xl bg-slate-50 p-4">
      <Icon aria-hidden="true" className="h-7 w-7 text-indigo-600" />
      <h3 className="mt-3 text-sm font-bold text-slate-950">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </article>
  );
}

