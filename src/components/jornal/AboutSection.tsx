import { Newspaper, Layers, PenTool } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const CARDS = [
  {
    icon: Newspaper,
    title: "Notícias",
    text: "Os principais acontecimentos reunidos em um único lugar.",
    tone: "var(--primary)",
  },
  {
    icon: Layers,
    title: "Contexto",
    text: "Informações organizadas para facilitar a compreensão dos acontecimentos.",
    tone: "var(--accent)",
  },
  {
    icon: PenTool,
    title: "Análises",
    text: "Conteúdo apresentado a partir da linha editorial do Jornal da Pátria.",
    tone: "var(--azul)",
  },
];

export function AboutSection() {
  return (
    <section id="o-jornal" className="relative border-t border-border section-y">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="O Jornal"
          title="POR TRÁS DO JORNAL DA PÁTRIA"
          description="Um projeto editorial criado para reunir informação, contexto e análise sobre os acontecimentos que movimentam o Brasil."
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-7">
          {CARDS.map((card, i) => (
            <Reveal as="li" key={card.title} delay={i * 110}>
              <article className="group relative h-full overflow-hidden rounded-md surface-card card-hover p-8 sm:p-9">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px opacity-70 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, ${card.tone}, transparent)`,
                  }}
                />
                <span className="font-display text-sm text-muted-foreground">
                  0{i + 1}
                </span>
                <span
                  className="mt-6 grid h-12 w-12 place-items-center rounded-sm border border-border transition-colors duration-500"
                  style={{ color: card.tone }}
                >
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-2xl tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {card.text}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
