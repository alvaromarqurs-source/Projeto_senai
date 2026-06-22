import axios from "axios";

import { api } from "./api";

export interface OnboardingPayload {
  nome: string;
  cpf: string;
  email: string;
  idade: number;
  renda_atual: number;
  aporte_mensal: number;
  reserva_de_emergencia: boolean;
  valor_armazenado_reserva_emergencia: number;
  possui_dividas: boolean;
  tolerancia_volatilidade: number;
  experiencia_em_investimentos: "Nenhuma" | "Iniciante" | "Intermediario" | "Avancado";
  aceitacao_perda_percentual: number;
  liquidez_necessaria: "Imediata" | "Curto_prazo" | "Medio_prazo" | "Longo_prazo";
  objetivo_de_vida: "Aposentadoria" | "Imovel" | "Viagens" | "Preservacao" | "Renda_passiva";
  tempo_estimado_retorno: number;
  valor_desejado_acumulado: number;
  preocupacao_atual: string;
}

export interface OnboardingResponse extends OnboardingPayload {
  id: number;
  tipo_de_investidor: "Conservador" | "Moderado" | "Agressivo" | null;
  perfil_sintetico: string | null;
}

export class OnboardingApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "OnboardingApiError";
  }
}

function validationDetails(data: unknown) {
  if (!data || typeof data !== "object") return null;

  const messages = Object.entries(data as Record<string, unknown>).flatMap(([field, value]) => {
    if (Array.isArray(value)) return value.map((item) => `${field}: ${String(item)}`);
    if (typeof value === "string") return [`${field}: ${value}`];
    return [];
  });

  return messages.length > 0 ? messages.join(" ") : null;
}

function apiError(error: unknown): OnboardingApiError {
  if (!axios.isAxiosError(error)) {
    return new OnboardingApiError("Não foi possível concluir o cadastro. Tente novamente.");
  }

  if (!error.response) {
    return new OnboardingApiError(
      "Não foi possível conectar ao servidor. Verifique se o backend está em execução.",
    );
  }

  const status = error.response.status;
  const messages: Record<number, string> = {
    400: validationDetails(error.response.data) ?? "Revise os dados informados e tente novamente.",
    401: "Sua sessão não está autorizada. Entre novamente para continuar.",
    403: "Você não tem permissão para concluir este cadastro.",
    404: "O serviço de cadastro não foi encontrado.",
    500: "O servidor encontrou um problema. Tente novamente em alguns instantes.",
  };

  return new OnboardingApiError(
    messages[status] ?? `Não foi possível concluir o cadastro (erro ${status}).`,
    status,
    error.response.data,
  );
}

export async function submitOnboarding(payload: OnboardingPayload) {
  try {
    const response = await api.post<OnboardingResponse>("/clients/", payload);
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}

export async function getOnboarding(id?: number) {
  try {
    const endpoint = id === undefined ? "/clients/" : `/clients/${id}/`;
    const response = await api.get<OnboardingResponse | OnboardingResponse[]>(endpoint);
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}

export async function updateOnboarding(id: number, payload: Partial<OnboardingPayload>) {
  try {
    const response = await api.patch<OnboardingResponse>(`/clients/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}
