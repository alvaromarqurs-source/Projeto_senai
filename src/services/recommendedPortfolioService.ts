import { api } from "./api";

export interface RecommendedPortfolioResponse {
  msg: string;
}

export async function getRecommendedPortfolio(email: string) {
  const response = await api.post<RecommendedPortfolioResponse>(
    "/indica-carteira/",
    { email },
    { timeout: 0 },
  );

  return response.data;
}
