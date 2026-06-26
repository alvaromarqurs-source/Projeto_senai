export interface ParsedInvestment {
  nome: string;
  valor: string;
  motivo: string;
}

export interface ParsedRecommendedPortfolio {
  resumo: string;
  investimentos: ParsedInvestment[];
  textoCarteira: string;
}

type InvestmentField = keyof ParsedInvestment;

function readField(line: string): { field: InvestmentField; value: string } | null {
  const match = line.match(/^(Nome do investimento|Valor recomendado(?: para investir)?|Motivo(?: da escolha)?):?\s*(.*)$/i);
  if (!match) return null;

  const label = match[1].toLowerCase();
  const field = label.startsWith("nome")
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

export function parseRecommendedPortfolio(message: string): ParsedRecommendedPortfolio {
  const normalized = message.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n");
  const portfolioIndex = lines.findIndex((line) =>
    /^Carteira recomendada:?$/i.test(line.trim()),
  );

  const summaryLines = portfolioIndex >= 0 ? lines.slice(0, portfolioIndex) : lines;
  const portfolioLines = portfolioIndex >= 0 ? lines.slice(portfolioIndex + 1) : [];
  const resumo = summaryLines
    .filter((line) => !isSummaryTitle(line))
    .join("\n")
    .trim();

  const investimentos: ParsedInvestment[] = [];
  let current: ParsedInvestment | null = null;
  let currentField: InvestmentField | null = null;

  for (const line of portfolioLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

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
