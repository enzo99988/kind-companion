/**
 * Configuração do checkout externo (Kirvano).
 *
 * Quando a URL oficial da Kirvano existir, basta preenchê-la aqui
 * (ou expor via VITE_KIRVANO_CHECKOUT_URL) por plano.
 * Enquanto estiver vazia, o botão não redireciona para nenhuma URL.
 */
export const KIRVANO_CHECKOUT_URL: Record<CheckoutPlanId, string> = {
  mensal: import.meta.env["VITE_KIRVANO_CHECKOUT_URL_MENSAL"] ?? "",
  trimestral: import.meta.env["VITE_KIRVANO_CHECKOUT_URL_TRIMESTRAL"] ?? "",
};

export type CheckoutPlanId = "mensal" | "trimestral";

export type CheckoutPlan = {
  id: CheckoutPlanId;
  name: string;
  price: string;
  period: string;
  accessDescription: string;
  benefits: string[];
};

export const CHECKOUT_PLANS: Record<CheckoutPlanId, CheckoutPlan> = {
  mensal: {
    id: "mensal",
    name: "Plano mensal",
    price: "R$ 9,80",
    period: "1 mês de acesso",
    accessDescription:
      "A assinatura concede acesso à área exclusiva do Jornal da Pátria durante 1 mês.",
    benefits: [
      "Acesso à área exclusiva do leitor",
      "Notícias e análises pela perspectiva editorial da direita brasileira",
      "Acompanhamento da política brasileira com contexto",
      "Suporte ao leitor",
    ],
  },
  trimestral: {
    id: "trimestral",
    name: "Plano de 3 meses",
    price: "R$ 22,22",
    period: "3 meses de acesso",
    accessDescription:
      "A assinatura concede acesso à área exclusiva do Jornal da Pátria durante 3 meses.",
    benefits: [
      "Acesso à área exclusiva do leitor por 3 meses",
      "Notícias e análises pela perspectiva editorial da direita brasileira",
      "Acompanhamento da política brasileira com contexto",
      "Suporte ao leitor",
    ],
  },
};

export function resolvePlan(id?: string | null): CheckoutPlan {
  return id === "trimestral" ? CHECKOUT_PLANS.trimestral : CHECKOUT_PLANS.mensal;
}

export function getCheckoutUrl(id: CheckoutPlanId): string | null {
  const url = KIRVANO_CHECKOUT_URL[id]?.trim();
  return url ? url : null;
}
