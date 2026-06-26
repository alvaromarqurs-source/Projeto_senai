import axios from "axios";

import { api } from "./api";

export interface RecommendedPortfolioRequest {
  email: string;
}

export type RecommendedPortfolioResponse = unknown;

export class RecommendedPortfolioApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "RecommendedPortfolioApiError";
  }
}

function recommendedPortfolioError(error: unknown): RecommendedPortfolioApiError {
  if (!axios.isAxiosError(error)) {
    return new RecommendedPortfolioApiError("Nao foi possivel buscar seu plano. Tente novamente.");
  }

  if (!error.response) {
    return new RecommendedPortfolioApiError(
      "Nao foi possivel conectar ao servidor. Verifique se o backend esta em execucao.",
    );
  }

  const status = error.response.status;
  const messages: Record<number, string> = {
    400: "Nao foi possivel buscar seu plano com o e-mail informado.",
    401: "Sua sessao nao esta autorizada. Entre novamente para continuar.",
    403: "Voce nao tem permissao para acessar este plano.",
    404: "Nenhum plano foi encontrado para este e-mail.",
    500: "O servidor encontrou um problema. Tente novamente em alguns instantes.",
  };

  return new RecommendedPortfolioApiError(
    messages[status] ?? `Nao foi possivel buscar seu plano (erro ${status}).`,
    status,
    error.response.data,
  );
}

export async function getRecommendedPortfolio(email: string) {
  try {
    const response = await api.post<RecommendedPortfolioResponse>("/indica-carteira/", { email });
    return response.data;
  } catch (error) {
    throw recommendedPortfolioError(error);
  }
}
