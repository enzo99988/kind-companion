import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import heroPhoto from "@/assets/home/exercito.jpg";


export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32"
    >
      {/* depth layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_18%_0%,color-mix(in_oklab,var(--azul)_28%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_20%,transparent),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px gold-rule opacity-40"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
        <div>
          <Reveal className="inline-flex items-center gap-3 rounded-full border border-border bg-navy/60 px-4 py-2 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="eyebrow text-muted-foreground">
              Jornal Digital • Conteúdo Editorial
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-8 font-display text-[clamp(2.75rem,8.4vw,6rem)] leading-[0.9] tracking-[-0.025em]">
              JORNAL
              <span className="block text-primary">DA PÁTRIA</span>
            </h1>
          </Reveal>

          <Reveal delay={150} className="mt-6 flex items-center gap-4">
            <span className="h-px w-14 gold-rule" />
            <p className="text-[0.72rem] font-semibold tracking-[0.2em] text-foreground/90 uppercase sm:text-sm">
              Informação. Contexto. Visão sobre o Brasil.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-8 max-w-xl font-display text-[1.35rem] leading-snug text-foreground/95 sm:text-2xl">
              O Brasil muda todos os dias. Entenda os acontecimentos que
              movimentam o país.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              O Jornal da Pátria reúne notícias, análises e contextos sobre os
              principais acontecimentos do Brasil, apresentados a partir de uma
              perspectiva editorial conservadora.
            </p>
          </Reveal>

          <Reveal delay={300} className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              to="/quiz"
              className="group inline-flex items-center gap-3 rounded-sm bg-primary px-7 py-4 text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
              style={{ boxShadow: "var(--shadow-gold)" }}
            >
              Conheça o Jornal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              <span className="h-6 w-px bg-border" />
              Edição contínua
            </div>
          </Reveal>
        </div>

        {/* premium oval image slot */}
        <Reveal delay={220} className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="absolute inset-6 rounded-[50%] border border-primary/25"
          />
          <div
            aria-hidden
            className="absolute -inset-2 rounded-[50%] bg-[conic-gradient(from_140deg,color-mix(in_oklab,var(--gold)_45%,transparent),transparent_35%,color-mix(in_oklab,var(--verde)_45%,transparent),transparent_75%)] opacity-45 blur-[3px]"
          />
          <div
            className="relative grid aspect-square place-items-center overflow-hidden rounded-[50%] border border-border bg-[linear-gradient(165deg,var(--navy-soft),var(--navy-deep))] p-4"
            style={{ boxShadow: "var(--shadow-editorial)" }}
          >
            <img
              src={heroPhoto}
              alt="Militares do Exército Brasileiro em formação diante da bandeira do Brasil"
              className="max-h-full w-full object-contain"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_10%,color-mix(in_oklab,var(--azul)_18%,transparent),transparent_70%)]"
            />
          </div>
          <div className="mt-12 grid grid-cols-3 gap-3 text-center">
            {["Notícias", "Contexto", "Análises"].map((label, i) => (
              <div
                key={label}
                className="rounded-sm border border-border bg-navy/50 px-2 py-3 text-[0.6rem] font-semibold tracking-[0.16em] uppercase"
                style={{
                  color:
                    i === 1
                      ? "var(--accent)"
                      : i === 2
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
