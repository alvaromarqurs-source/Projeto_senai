export type Client = {
  nome: string;
  cpf: string;
  email: string;
  idade: number;
  renda_atual: string;
  aporte_mensal: string;
  reserva_de_emergencia: boolean;
  valor_armazenado_reserva_emergencia: string;
  possui_dividas: boolean;
  objetivo_de_vida: string;
  tempo_estimado_retorno: number;
  valor_desejado_acumulado: string;
  preocupacao_atual: string;
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
