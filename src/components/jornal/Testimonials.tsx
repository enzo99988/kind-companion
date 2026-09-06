import { Star, Quote } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import leitor1 from "@/assets/testimonials/leitor-1.jpg";
import leitor2 from "@/assets/testimonials/leitor-2.jpg";
import leitor3 from "@/assets/testimonials/leitor-3.jpg";

const SLOTS = [
  {
    id: 1,
    name: "Carlos Menezes",
    role: "Belo Horizonte / MG",
    photo: leitor1,
    rating: 5,
    quote:
      "Finalmente um jornal que vai direto ao ponto. Leio todas as manhãs e me sinto muito mais informado sobre o que realmente acontece no país.",
  },
  {
    id: 2,
    name: "Patrícia Almeida",
    role: "Curitiba / PR",
    photo: leitor2,
    rating: 5,
    quote:
      "O áudio das notícias mudou minha rotina. Escuto no trânsito e chego no trabalho já sabendo de tudo. Vale cada centavo.",
  },
  {
    id: 3,
    name: "Rafael Santiago",
    role: "Recife / PE",
    photo: leitor3,
    rating: 5,
    quote:
      "Conteúdo sério, sem enrolação e com linguagem clara. É o único noticiário que recomendo para a minha família.",
  },
];


export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="relative border-t border-border section-y"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Leitores"
          title="O QUE OS LEITORES ESTÃO DIZENDO"
          description="Espaços preparados para receber depoimentos reais de leitores."
        />

        {/* Prova social — número real a ser preenchido quando confirmado */}
        <Reveal className="mt-12">
          <div className="relative overflow-hidden rounded-md surface-card p-8 sm:p-10">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px gold-rule opacity-80"
            />
            <div className="grid items-center gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10">
              <div className="min-w-0">
                <span className="eyebrow text-accent">Prova social</span>
                <p
                  className="mt-3 font-display text-[clamp(2.5rem,9vw,4.5rem)] leading-[0.9] tracking-tight text-primary"
                  style={{ textShadow: "0 18px 44px color-mix(in oklab, var(--gold) 22%, transparent)" }}
                >
                  +10.000
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[0.18em] text-foreground/85 uppercase">
                  Leitores
                </p>
              </div>
              <div className="min-w-0 border-t border-border pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Espaço reservado para a métrica oficial de leitores ou
                  compradores. O número acima é apenas um exemplo visual e deve
                  ser substituído pelo dado real antes da publicação.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-navy/60 px-3 py-2 text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Dado a confirmar
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-sm border border-primary/35 px-3 py-2 text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Exibir quando verificado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>


        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {SLOTS.map((slot, i) => (
            <Reveal as="li" key={slot.id} delay={i * 110}>
              <article className="group h-full rounded-md surface-card card-hover p-8 sm:p-9">
                <Quote className="h-6 w-6 text-primary/70" />
                <p className="mt-5 font-display text-lg leading-snug text-foreground/80">
                  [Espaço para depoimento — texto a ser inserido]
                </p>
                <div className="mt-6 flex items-center gap-1" aria-label="Espaço para avaliação">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 text-primary/40" />
                  ))}
                  <span className="ml-2 text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Avaliação
                  </span>
                </div>
                <div className="mt-7 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-t border-border pt-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-navy text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {slot.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {slot.role}
                    </span>
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
