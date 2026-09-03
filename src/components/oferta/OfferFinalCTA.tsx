import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/jornal/Reveal";

export function OfferFinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-[linear-gradient(180deg,var(--navy),var(--navy-deep))] py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px gold-rule"
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal className="flex items-center justify-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="eyebrow text-muted-foreground">Edição Digital</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 text-balance-editorial text-[clamp(2rem,6vw,4rem)] leading-[0.98] tracking-tight">
            PRONTO PARA CONHECER O JORNAL DA PÁTRIA?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tenha acesso ao conteúdo do Jornal da Pátria e acompanhe os
            principais acontecimentos do Brasil pela nossa perspectiva
            editorial da direita brasileira.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <Link
            to="/checkout"
            search={{ plano: "mensal" }}
            className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary px-8 py-4 text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
            style={{ boxShadow: "var(--shadow-gold)" }}
          >
            CONHECER O JORNAL
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
