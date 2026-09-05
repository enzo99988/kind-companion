import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Info, Lock, ShieldCheck } from "lucide-react";
import {
  CHECKOUT_PLANS,
  getCheckoutUrl,
  resolvePlan,
  type CheckoutPlanId,
} from "@/lib/checkout-config";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    plano: (search["plano"] === "trimestral" ? "trimestral" : "mensal") as CheckoutPlanId,
  }),
  head: () => ({
    meta: [
      { title: "Checkout — Jornal da Pátria" },
      {
        name: "description",
        content:
          "Revise seu plano do Jornal da Pátria e continue para o pagamento seguro do acesso à área exclusiva.",
      },
      { property: "og:title", content: "Checkout — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Revise seu plano e o período de acesso ao Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { plano } = Route.useSearch();
  const plan = resolvePlan(plano);
  const checkoutUrl = getCheckoutUrl(plan.id);
  const otherPlan = CHECKOUT_PLANS[plan.id === "mensal" ? "trimestral" : "mensal"];

  return (
    <div className="app-theme min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link to="/oferta" className="flex items-center gap-3">
            <BrandLogo className="h-9 w-9" />
            <span className="font-display text-lg tracking-tight text-foreground">
              JORNAL DA PÁTRIA
            </span>
          </Link>
          <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            <Lock className="h-3.5 w-3.5 text-accent" />
            Checkout
          </span>
        </div>
        <div className="brasil-rule h-[3px] w-full opacity-70" aria-hidden />
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
          Revisar assinatura
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Confira o plano selecionado antes de continuar para o pagamento. O
          pagamento é processado por uma plataforma externa segura.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <section className="app-card rounded-lg p-6 sm:p-8">
            <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] text-primary uppercase">
              Plano selecionado
            </span>
            <h2 className="mt-4 font-display text-2xl tracking-tight text-foreground">
              {plan.name}
            </h2>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="font-display text-4xl leading-none text-primary sm:text-5xl">
                {plan.price}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">{plan.period}</p>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                O que está incluído
              </h3>
              <ul className="mt-4 space-y-3">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                      <Check className="h-3 w-3" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-md border border-border bg-secondary/60 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Info className="h-4 w-4 text-primary" />
                Informações importantes sobre o acesso
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>{plan.accessDescription}</li>
                <li>
                  O acesso é individual e vinculado à conta cadastrada no Jornal da
                  Pátria.
                </li>
                <li>
                  Após o pagamento, a liberação do acesso à área exclusiva é
                  confirmada pela equipe do Jornal da Pátria.
                </li>
                <li>
                  Ao final do período contratado, o acesso à área exclusiva é
                  encerrado.
                </li>
              </ul>
            </div>
          </section>

          <aside className="app-card rounded-lg p-6 sm:p-8 lg:sticky lg:top-8">
            <h2 className="text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
              Resumo
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Plano</dt>
                <dd className="font-medium text-foreground">{plan.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Período</dt>
                <dd className="font-medium text-foreground">{plan.period}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-display text-xl text-primary">{plan.price}</dd>
              </div>
            </dl>

            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="press mt-6 inline-flex w-full items-center justify-center rounded-sm bg-primary px-6 py-4 text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase"
              >
                Continuar para pagamento
              </a>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  aria-describedby="checkout-pending"
                  className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-sm bg-primary/45 px-6 py-4 text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase"
                >
                  Continuar para pagamento
                </button>
                <p id="checkout-pending" className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  O link oficial de pagamento ainda não está configurado. Assim que
                  ele for definido, este botão levará diretamente ao pagamento
                  seguro.
                </p>
              </>
            )}

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              O pagamento acontece em ambiente externo seguro. Nenhum dado de
              cartão é solicitado ou armazenado nesta página.
            </p>

            <div className="mt-6 border-t border-border pt-5">
              <Link
                to="/checkout"
                search={{ plano: otherPlan.id }}
                className="text-xs font-semibold tracking-[0.08em] text-primary uppercase hover:underline"
              >
                Trocar para {otherPlan.name.toLowerCase()} — {otherPlan.price}
              </Link>
            </div>

            <Link
              to="/oferta"
              className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar à oferta
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
