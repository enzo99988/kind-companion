import { FileText } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";

const PAGES = [
  { label: "Capa", note: "Página de abertura" },
  { label: "Reportagem", note: "Matéria principal" },
  { label: "Análise", note: "Coluna editorial" },
];

export function NewspaperPreview() {
  return (
    <section className="relative border-t border-border section-y">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Edições"
          title="VEJA O JORNAL POR DENTRO"
          description="Conheça a estrutura das edições e veja como o conteúdo é apresentado."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-end">
          {PAGES.map((page, i) => (
            <Reveal key={page.label} delay={i * 110}>
              <figure
                className={cn(
                  "group relative overflow-hidden rounded-md surface-card card-hover",
                  i === 1 && "md:-mb-6 md:scale-[1.04]",
                )}
              >
                <div className="relative aspect-[3/4] bg-[linear-gradient(170deg,var(--navy-soft),var(--navy-deep))]">
                  <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,color-mix(in_oklab,var(--azul)_18%,transparent),transparent_70%)]" />
                  {/* editorial mockup lines */}
                  <div className="absolute inset-6 flex flex-col gap-3">
                    <div className="h-2 w-24 gold-rule rounded-full" />
                    <div className="h-6 w-4/5 rounded-sm bg-foreground/12" />
                    <div className="h-6 w-3/5 rounded-sm bg-foreground/12" />
                    <div className="mt-2 h-24 rounded-sm border border-border bg-foreground/5" />
                    <div className="mt-1 space-y-2">
                      {[92, 84, 76, 88, 64].map((w, k) => (
                        <div
                          key={k}
                          className="h-1.5 rounded-full bg-foreground/10"
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="absolute right-5 bottom-5 grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <FileText className="h-4 w-4" />
                  </span>
                </div>
                <figcaption className="flex items-center justify-between border-t border-border px-6 py-5">
                  <span className="font-display text-lg">{page.label}</span>
                  <span className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {page.note}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
