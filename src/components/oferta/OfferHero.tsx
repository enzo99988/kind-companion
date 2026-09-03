import { ArrowDown } from "lucide-react";
import { Reveal } from "@/components/jornal/Reveal";

export function OfferHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--azul)_28%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px gold-rule opacity-40"
      />

      <div className="relative mx-auto max-w-5xl px-5 text-center lg:px-8">
        <Reveal className="inline-flex items-center gap-3 rounded-full border border-border bg-navy/60 px-4 py-2 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="eyebrow text-muted-foreground">
            Edição Digital • Conteúdo Editorial
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 font-display text-[clamp(2.75rem,9vw,6rem)] leading-[0.92] tracking-[-0.025em]">
            JORNAL
            <span className="block text-primary">DA PÁTRIA</span>
          </h1>
        </Reveal>

        <Reveal delay={150}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground/95 sm:text-xl">
            Informação, contexto e acompanhamento dos principais acontecimentos
            do Brasil pela perspectiva da direita brasileira.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="mx-auto mt-10 max-w-3xl rounded-lg border border-primary/30 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--navy-soft)_85%,transparent),color-mix(in_oklab,var(--navy-deep)_92%,transparent))] px-6 py-6 sm:px-10 sm:py-8">
            <p className="font-display text-[clamp(1.25rem,4vw,1.85rem)] leading-tight tracking-tight text-foreground">
              FIQUE POR DENTRO DO QUE ESTÁ MOVIMENTANDO O BRASIL
            </p>
            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 gold-rule" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="h-px w-10 gold-rule" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <a
            href="#oferta"
            className="group mt-12 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            Conheça a oferta
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
