export interface ParsedInvestment {
  nome: string;
  valor: string;
  motivo: string;
}

export type PortfolioParsed = {
  resumo: string;
  investimentos: ParsedInvestment[];
  textoCarteira: string;
};

export type ParsedRecommendedPortfolio = PortfolioParsed;

type InvestmentField = keyof ParsedInvestment;

function readField(line: string): { field: InvestmentField; value: string } | null {
  const match = line.match(
    /^(Nome do investimento|Investimento|Ativo|Valor recomendado(?: para investir)?|Valor(?: para investir)?|Motivo(?: da escolha)?|Justificativa):?\s*(.*)$/i,
  );
  if (!match) return null;

  const label = match[1].toLowerCase();
  const field = label.startsWith("nome")
    || label.startsWith("investimento")
    || label.startsWith("ativo")
    ? "nome"
    : label.startsWith("valor")
      ? "valor"
      : "motivo";

  return { field, value: match[2].trim() };
}

function appendValue(current: ParsedInvestment, field: InvestmentField, value: string) {
  current[field] = [current[field], value].filter(Boolean).join("\n");
}

function isSummaryTitle(line: string) {
  return /^Resumo da estrat.gia:?$/i.test(line.trim());
}

function isPortfolioTitle(line: string) {
  return /^Carteira recomendada:?$/i.test(line.trim());
}

function isBulletOnly(line: string) {
  return /^[-*•]\s*$/.test(line.trim());
}

function normalizeLine(line: string) {
  return line.replace(/^[-*•]\s*/, "").trim();
}

function splitSections(lines: string[]) {
  const summaryIndex = lines.findIndex((line) => isSummaryTitle(line));
  const portfolioIndex = lines.findIndex((line) => isPortfolioTitle(line));

  if (portfolioIndex < 0) {
    return {
      summaryLines: summaryIndex >= 0 ? lines.slice(summaryIndex + 1) : lines,
      portfolioLines: [] as string[],
    };
  }

  const summaryStart = summaryIndex >= 0 && summaryIndex < portfolioIndex ? summaryIndex + 1 : 0;
  return {
    summaryLines: lines.slice(summaryStart, portfolioIndex),
    portfolioLines: lines.slice(portfolioIndex + 1),
  };
}

export function parseRecommendedPortfolio(message: string): ParsedRecommendedPortfolio {
  const normalized = message.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n");
  const { summaryLines, portfolioLines } = splitSections(lines);
  const resumo = summaryLines
    .filter((line) => !isSummaryTitle(line))
    .join("\n")
    .trim();

  const investimentos: ParsedInvestment[] = [];
  let current: ParsedInvestment | null = null;
  let currentField: InvestmentField | null = null;

  for (const line of portfolioLines) {
    const trimmed = normalizeLine(line);
    if (!trimmed || isBulletOnly(line)) continue;

    const parsedField = readField(trimmed);
    if (parsedField) {
      if (parsedField.field === "nome") {
        if (current && (current.nome || current.valor || current.motivo)) {
          investimentos.push(current);
        }
        current = { nome: parsedField.value, valor: "", motivo: "" };
      } else {
        current ??= { nome: "", valor: "", motivo: "" };
        appendValue(current, parsedField.field, parsedField.value);
      }
      currentField = parsedField.field;
      continue;
    }

    if (current && currentField) {
      appendValue(current, currentField, trimmed);
    }
  }

  if (current && (current.nome || current.valor || current.motivo)) {
    investimentos.push(current);
  }

  return {
    resumo,
    investimentos,
    textoCarteira: portfolioLines.join("\n").trim(),
  };
}
