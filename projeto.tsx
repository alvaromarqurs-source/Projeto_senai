import * as React from "react";

type InvestorForm = {
  nome: string;
  cpf: string;
  gmail: string;
  idade: string;
  rendaAtual: string;
  dor: string;
};

type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "onChange" | "value"
> & {
  id: keyof InvestorForm;
  label: string;
  icon: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
};

type TextAreaFieldProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className" | "onChange" | "value"
> & {
  id: keyof InvestorForm;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

const steps = [
  "Informações pessoais",
  "Situação financeira",
  "Objetivos",
  "Perfil de risco",
  "Revisão",
  "Conclusão",
];

const initialForm: InvestorForm = {
  nome: "",
  cpf: "",
  gmail: "",
  idade: "",
  rendaAtual: "",
  dor: "",
};

const inputClassName =
  "w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

const iconClassName =
  "absolute inset-y-0 left-0 flex min-w-10 items-center justify-center text-xs font-semibold text-gray-400";

function getStepIndicatorClassName(isActive: boolean, isDone: boolean) {
  if (isDone) {
    return "bg-indigo-600 text-white";
  }

  if (isActive) {
    return "bg-white text-indigo-700 ring-2 ring-indigo-600";
  }

  return "bg-gray-100 text-gray-500";
}

function TextField({
  id,
  label,
  icon,
  value,
  onValueChange,
  ...inputProps
}: TextFieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-2 text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden="true" className={iconClassName}>
          {icon}
        </span>
        <input
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className={inputClassName}
          {...inputProps}
        />
      </div>
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onValueChange,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-2 text-sm font-semibold text-gray-800">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="min-h-32 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        {...textareaProps}
      />
    </div>
  );
}

export default function InvestorProfileOnboarding() {
  const [form, setForm] = React.useState<InvestorForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const currentStep = 1;
  const progress = (currentStep / steps.length) * 100;

  function updateField(field: keyof InvestorForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  function handleExit() {
    setForm(initialForm);
    setIsSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:min-h-[720px] lg:w-80">
          <div>
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Perfil do Investidor
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900">
              Onboarding da sua jornada financeira
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Responda algumas perguntas para personalizar sua experiência e
              deixar seu perfil pronto para a próxima etapa.
            </p>
          </div>

          <nav aria-label="Etapas do onboarding" className="mt-8 flex-1 space-y-3">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isDone = stepNumber < currentStep;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                    isActive
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getStepIndicatorClassName(
                      isActive,
                      isDone,
                    )}`}
                  >
                    {stepNumber}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{step}</p>
                    <p className="text-xs text-gray-500">
                      Passo {stepNumber} de {steps.length}
                    </p>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">
              Ambiente seguro
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Seus dados são usados apenas para montar seu perfil inicial e
              orientar a conversa com mais precisão.
            </p>
          </div>
        </aside>

        <section className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  Passo {currentStep} de {steps.length}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Informações pessoais
                </h2>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                6 campos
              </span>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              id="nome"
              label="Nome do usuário"
              icon="N"
              type="text"
              value={form.nome}
              onValueChange={(value) => updateField("nome", value)}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              required
            />

            <TextField
              id="cpf"
              label="CPF"
              icon="ID"
              type="text"
              value={form.cpf}
              onValueChange={(value) => updateField("cpf", value)}
              placeholder="000.000.000-00"
              inputMode="numeric"
              autoComplete="off"
              required
            />

            <TextField
              id="gmail"
              label="Gmail"
              icon="@"
              type="email"
              value={form.gmail}
              onValueChange={(value) => updateField("gmail", value)}
              placeholder="seuemail@gmail.com"
              autoComplete="email"
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="idade"
                label="Idade"
                icon="18"
                type="number"
                min={18}
                value={form.idade}
                onValueChange={(value) => updateField("idade", value)}
                placeholder="Ex.: 30"
                required
              />

              <TextField
                id="rendaAtual"
                label="Renda atual"
                icon="R$"
                type="text"
                value={form.rendaAtual}
                onValueChange={(value) => updateField("rendaAtual", value)}
                placeholder="Ex.: R$ 5.000,00"
                inputMode="decimal"
                required
              />
            </div>

            <TextAreaField
              id="dor"
              label="Dor"
              value={form.dor}
              onValueChange={(value) => updateField("dor", value)}
              placeholder="Qual sua maior dificuldade financeira hoje?"
              required
            />

            {isSubmitted && (
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-800">
                  Dados recebidos com sucesso.
                </p>
                <p className="mt-1 text-sm text-green-700">
                  O próximo passo pode ser conectado quando o fluxo completo for
                  implementado.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-900">
                Por que estamos perguntando isso?
              </p>
              <p className="mt-2 text-sm leading-6 text-indigo-700">
                Essas informações ajudam a entender sua realidade financeira,
                seu momento de vida e quais próximos passos fazem sentido para
                sua jornada como investidor.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleExit}
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Sair
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Continuar -&gt;
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
