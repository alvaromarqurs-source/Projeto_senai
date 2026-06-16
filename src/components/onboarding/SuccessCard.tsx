import * as React from "react";

type SuccessCardProps = {
  title?: string;
  children: React.ReactNode;
};

export function SuccessCard({
  title = "Informações recebidas com sucesso!",
  children,
}: SuccessCardProps) {
  return (
    <aside
      aria-live="polite"
      className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700"
    >
      <p className="text-sm font-bold text-emerald-800">{title}</p>
      <div className="mt-1 text-sm leading-6">{children}</div>
    </aside>
  );
}
