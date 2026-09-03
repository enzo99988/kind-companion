import { Newspaper, BookOpen, Landmark, Headphones } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/jornal/Reveal";

const FEATURES = [
  {
    icon: Newspaper,
    title: "Notícias",
    description:
      "Os principais acontecimentos acompanhados e organizados em um só lugar.",
    accent: "primary",
  },
  {
    icon: BookOpen,
    title: "Contexto",
    description:
      "Entenda melhor os acontecimentos e o cenário por trás das notícias.",
    accent: "accent",
  },
  {
    icon: Landmark,
    title: "Política Brasileira de Direita",
    description:
      "Acompanhe acontecimentos e temas relevantes da política brasileira sob a perspectiva editorial do Jornal da Pátria.",
    accent: "primary",
  },
  {
    icon: Headphones,
    title: "Conteúdo em Áudio",
    description:
      "Quando disponível, ouça as notícias em vez de apenas ler.",
    accent: "accent",
  },
];

export function OfferFeatures() {
  return (
    <section className="section-y border-t border-border bg-[linear-gradient(180deg,var(--navy-deep),var(--navy))]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="O que você encontra"
          title="O QUE VOCÊ ENCONTRA NO JORNAL"
          description="Uma experiência editorial pensada para quem quer acompanhar o Brasil de direita com clareza e contexto."
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80}>
              <div className="card-hover surface-card h-full rounded-lg p-6">
                <span
                  className="grid h-11 w-11 place-items-center rounded-sm border border-border"
                  style={{
                    color: `var(--${feature.accent})`,
                    borderColor: `color-mix(in oklab, var(--${feature.accent}) 30%, transparent)`,
                  }}
                >
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
