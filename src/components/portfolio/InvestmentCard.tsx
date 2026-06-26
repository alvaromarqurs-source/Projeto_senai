import { CircleDollarSign, FileText, Landmark } from "lucide-react";

import type { ParsedInvestment } from "../../utils/recommendedPortfolioParser";

function formatParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function InvestmentCard({ investment }: { investment: ParsedInvestment }) {
  const paragraphs = formatParagraphs(investment.motivo);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-indigo-600">
          <Landmark aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Investimento recomendado
          </p>
          <h4 className="mt-1 text-lg font-bold text-slate-950">
            {investment.nome || "Investimento recomendado"}
          </h4>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-indigo-50 px-4 py-4 ring-1 ring-indigo-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
          <CircleDollarSign aria-hidden="true" className="h-4 w-4" />
          Valor recomendado
        </div>
        <p className="mt-2 text-2xl font-bold text-indigo-700 sm:text-[1.75rem]">
          {investment.valor || "Valor nao informado"}
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-slate-400" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-950">Motivo da escolha</p>
          <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))
            ) : (
              <p>Motivo nao informado.</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
