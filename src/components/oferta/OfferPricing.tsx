import { Link } from "@tanstack/react-router";
import { Check, Shield, CalendarDays } from "lucide-react";
import { Reveal } from "@/components/jornal/Reveal";

// Valores editáveis posteriormente
export const OFFER_PRICES = {
  oneMonth: "R$ 9,80",
  threeMonths: "R$ 22,22",
} as const;

const ONE_MONTH_FEATURES = [
  "Acesso ao conteúdo por 1 mês",
  "Notícias e contextos editoriais",
  "Acompanhamento político",
  "Suporte ao leitor",
];

export function OfferPricing() {
  return (
    <section id="oferta" className="section-y border-t border-border bg-[linear-gradient(180deg,var(--navy),var(--navy-deep))]">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal className="text-center">
          <span className="eyebrow text-primary">Condição especial</span>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 surface-card relative overflow-hidden rounded-xl border-primary/30 p-8 sm:p-12 lg:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_65%)] blur-2xl"
            />
            <div className="relative">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.16em] text-primary uppercase">
                  CONDIÇÃO ESPECIAL PARA VOCÊ, PATRIOTA 🇧🇷
                </span>
                <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
                  JORNAL DA PÁTRIA
                </h2>
              </div>

              <div className="mt-8 text-center">
                <p className="font-display text-[clamp(3.5rem,12vw,6rem)] leading-none text-primary">
                  {OFFER_PRICES.oneMonth}
                </p>
                <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  ACESSO POR 1 MÊS
                </p>
              </div>

              <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-muted-foreground">
                Tenha acesso ao conteúdo do Jornal da Pátria e acompanhe os
                principais acontecimentos da direita brasileira.
              </p>

              <div className="mx-auto mt-8 max-w-md">
                <ul className="space-y-3">
                  {ONE_MONTH_FEATURES.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground/90"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/15 text-accent">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 text-center">
                <Link
                  to="/checkout"
                  search={{ plano: "mensal" }}
                  className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-10 py-5 text-sm font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
                  style={{ boxShadow: "var(--shadow-gold)" }}
                >
                  QUERO CONHECER O JORNAL
                </Link>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  <span className="inline-flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-accent" />
                    Pagamento seguro
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    Garantia de 7 dias
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 rounded-lg border border-border bg-navy/40 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-2xl tracking-tight">
                  QUER GARANTIR 3 MESES?
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Uma opção para quem deseja continuar acompanhando o Jornal da
                  Pátria por mais tempo.
                </p>
              </div>
              <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
                <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] text-accent uppercase">
                  3 MESES DE ACESSO
                </span>
                <p className="font-display text-3xl text-foreground">
                  {OFFER_PRICES.threeMonths}
                </p>
                <Link
                  to="/checkout"
                  search={{ plano: "trimestral" }}
                  className="inline-flex items-center justify-center rounded-sm border border-border px-6 py-3 text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:border-primary/60 hover:text-primary"
                >
                  Escolher 3 meses
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
