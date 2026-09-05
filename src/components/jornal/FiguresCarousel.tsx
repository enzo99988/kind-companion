import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";
import jairPhoto from "@/assets/figures/jair-bolsonaro.jpg";
import flavioPhoto from "@/assets/figures/flavio-bolsonaro.jpg";
import nikolasPhoto from "@/assets/figures/nikolas-ferreira.jpg";

type Figure = {
  name: string;
  category: string;
  bio: string;
  photo: string;
};

const FIGURES: Figure[] = [
  {
    name: "Jair Bolsonaro",
    category: "Presidência da República",
    bio: "Político brasileiro, ex-militar do Exército, deputado federal pelo Rio de Janeiro por sete mandatos e Presidente da República entre 2019 e 2022.",
    photo: jairPhoto,
  },
  {
    name: "Flávio Bolsonaro",
    category: "Senado Federal",
    bio: "Político brasileiro, senador da República pelo estado do Rio de Janeiro, eleito em 2018 após atuar como deputado estadual no mesmo estado.",
    photo: flavioPhoto,
  },
  {
    name: "Nikolas Ferreira",
    category: "Câmara dos Deputados",
    bio: "Político brasileiro, deputado federal por Minas Gerais eleito em 2022, tendo exercido anteriormente o mandato de vereador em Belo Horizonte.",
    photo: nikolasPhoto,
  },
];

export function FiguresCarousel() {
  const [index, setIndex] = useState(0);
  const total = FIGURES.length;
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const current = FIGURES[index]!;
  const next = FIGURES[(index + 1) % total]!;

  return (
    <section
      id="figuras"
      className="relative overflow-hidden border-t border-border bg-[linear-gradient(180deg,var(--navy-deep),var(--navy))] section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(70%_60%_at_100%_40%,color-mix(in_oklab,var(--azul)_22%,transparent),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Perfis"
          title="FIGURAS QUE MARCARAM A POLÍTICA BRASILEIRA"
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.6fr_0.7fr] lg:items-stretch">
          {/* main figure */}
          <Reveal className="relative overflow-hidden rounded-lg surface-card card-hover">
            <div className="grid gap-0 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="relative min-h-[280px] border-b border-border bg-[linear-gradient(165deg,var(--navy-soft),var(--navy-deep))] sm:min-h-[420px] sm:border-r sm:border-b-0">
                <img
                  src={current.photo}
                  alt={`Foto de ${current.name}`}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_15%,color-mix(in_oklab,var(--gold)_14%,transparent),transparent_70%)]" />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px gold-rule"
                />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <span className="eyebrow text-accent">{current.category}</span>
                <h3 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.05] tracking-[-0.015em]">
                  {current.name}
                </h3>
                <span className="mt-5 h-px w-16 gold-rule" />
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {current.bio}
                </p>
                <button
                  type="button"
                  className="group mt-8 inline-flex w-fit items-center gap-3 rounded-sm border border-primary/50 px-6 py-3 text-[0.7rem] font-bold tracking-[0.16em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Saiba mais
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* peek of next figure (desktop) */}
          <Reveal
            delay={120}
            className="hidden overflow-hidden rounded-lg border border-border bg-navy/50 card-hover lg:block"
          >
            <button
              type="button"
              onClick={() => go(1)}
              className="group flex h-full w-full flex-col text-left"
            >
              <span className="relative flex-1 overflow-hidden bg-[linear-gradient(165deg,var(--navy-soft),var(--navy-deep))]">
                <img
                  src={next.photo}
                  alt={`Foto de ${next.name}`}
                  className="absolute inset-0 h-full w-full object-cover object-top opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                />
              </span>
              <span className="border-t border-border p-6">
                <span className="eyebrow block text-muted-foreground">
                  A seguir
                </span>
                <span className="mt-2 block font-display text-xl">
                  {next.name}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {next.category}
                </span>
              </span>
            </button>
          </Reveal>
        </div>

        {/* controls */}
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-2">
            {FIGURES.map((fig, i) => (
              <button
                key={fig.name}
                type="button"
                aria-label={`Ver ${fig.name}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === index ? "w-14 bg-primary" : "w-6 bg-border hover:bg-muted-foreground",
                )}
              />
            ))}
            <span className="ml-3 font-display text-sm text-muted-foreground">
              0{index + 1} / 0{total}
            </span>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Figura anterior"
              onClick={() => go(-1)}
              className="grid h-11 w-11 place-items-center rounded-sm border border-border/70 text-muted-foreground transition-all duration-[240ms] hover:border-primary/60 hover:bg-navy/80 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Próxima figura"
              onClick={() => go(1)}
              className="grid h-11 w-11 place-items-center rounded-sm border border-border/70 text-muted-foreground transition-all duration-[240ms] hover:border-primary/60 hover:bg-navy/80 hover:text-primary"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
