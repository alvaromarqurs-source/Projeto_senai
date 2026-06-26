import { Sparkles } from "lucide-react";

import type { ParsedRecommendedPortfolio } from "../../utils/recommendedPortfolioParser";
import { InvestmentCard } from "./InvestmentCard";

function paragraphsFromText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function RecommendedPortfolioView({
  portfolio,
}: {
  portfolio: ParsedRecommendedPortfolio;
}) {
  const summaryParagraphs = paragraphsFromText(portfolio.resumo);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Plano personalizado
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Resumo da estratégia
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-6 sm:py-7">
        <section>
          <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
            {summaryParagraphs.length > 0 ? (
              summaryParagraphs.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))
            ) : (
              <p>Estratégia recebida com sucesso.</p>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Alocação sugerida
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">
                Carteira recomendada
              </h3>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {portfolio.investimentos.length} ativo{portfolio.investimentos.length === 1 ? "" : "s"}
            </div>
          </div>

          {portfolio.investimentos.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {portfolio.investimentos.map((investment, index) => (
                <InvestmentCard key={`${investment.nome}-${index}`} investment={investment} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 whitespace-pre-line">
              {portfolio.textoCarteira || "A carteira foi gerada, mas nao foi possivel separar os investimentos em cards."}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
