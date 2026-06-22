export type Client = {
  dadosPessoais: {
    nome: string;
    cpf: string;
    email: string;
    idade: number;
    rendaAtual: string;
    dor: string;
  };
  situacaoFinanceira: {
    aporteMensal: string;
    reservaDeEmergencia: boolean;
    valorReservaEmergencia: string;
    possuiDividas: boolean;
    rendaComprometida: number;
  };
  objetivos: {
    objetivo: string;
    prazo: number;
    metaFinanceira: string;
    preocupacao: string;
  };
  perfilInvestidor: {
    liquidezNecessaria: string;
    aceitacaoPerdaPercentual: number;
    experienciaInvestimentos: string;
    toleranciaVolatilidade: string;
    objetivoVida: string;
  };
};

const apiBaseUrl = "http://127.0.0.1:8000/api/v1";

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as unknown;

    if (typeof body === "string") return body;

    if (body && typeof body === "object") {
      const detail = "detail" in body ? body.detail : undefined;
      if (typeof detail === "string") return detail;
      return JSON.stringify(body);
    }
  } catch {
    // A resposta pode não ser JSON.
  }

  return `Erro HTTP ${response.status}`;
}

export async function createClient(payload: Client) {
  const response = await fetch(`${apiBaseUrl}/clients/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) return null;

  return response.json().catch(() => null);
}
