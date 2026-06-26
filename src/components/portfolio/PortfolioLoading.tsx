export function PortfolioLoading() {
  return (
    <section
      aria-live="polite"
      className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-5 py-8 text-center shadow-sm sm:px-6 sm:py-10"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-indigo-100">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" />
      </div>
      <div className="mx-auto mt-6 max-w-2xl">
        <h3 className="text-lg font-bold text-slate-950 sm:text-xl">
          Aguarde um instante enquanto geramos sua carteira personalizada.
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
          Estamos analisando seu perfil de investidor e selecionando os ativos mais adequados para você.
        </p>
      </div>
      <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
        {["Leitura do perfil", "Montagem da estratégia", "Seleção dos ativos"].map((item, index) => (
          <div key={item} className="rounded-xl border border-white/70 bg-white/80 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Etapa {index + 1}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
