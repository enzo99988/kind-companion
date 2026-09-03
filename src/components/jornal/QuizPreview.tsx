import { Target, BookOpen, Landmark } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";


export function QuizPreview() {
  return (
    <section
      id="quiz"
      className="relative overflow-hidden border-t border-border section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_oklab,var(--verde)_12%,transparent),transparent_50%,color-mix(in_oklab,var(--gold)_12%,transparent))]"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 rounded-lg surface-card p-7 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-16">
          <div>
            <Reveal className="flex items-center gap-3">
              <span className="h-px w-10 gold-rule" />
              <span className="eyebrow text-accent">Desafio Editorial</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 text-balance-editorial text-[clamp(1.9rem,4.4vw,3.35rem)] leading-[1.02] tracking-[-0.015em]">
                TESTE SEUS CONHECIMENTOS
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Um desafio interativo sobre história, política, instituições e
                acontecimentos brasileiros.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <Link
                to="/quiz"
                className="mt-9 inline-flex items-center rounded-sm bg-primary px-7 py-4 text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
                style={{ boxShadow: "var(--shadow-gold)" }}
              >
                Começar o Quiz
              </Link>
            </Reveal>

          </div>

          <Reveal delay={140} className="grid gap-4">
            {[
              { icon: BookOpen, label: "História", note: "Fatos e períodos" },
              { icon: Landmark, label: "Instituições", note: "Estrutura do Estado" },
              { icon: Target, label: "Atualidades", note: "Acontecimentos recentes" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-md border border-border bg-navy/60 px-5 py-4 transition-all duration-[260ms] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-navy/80"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.note}
                  </span>
                </span>
                <span className="shrink-0 font-display text-sm text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
