import { RefreshCw } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/jornal/Reveal";

export function OfferUpdates() {
  return (
    <section className="section-y border-t border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="surface-card rounded-lg p-8 lg:p-12">
              <span className="grid h-14 w-14 place-items-center rounded-sm border border-accent/30 text-accent">
                <RefreshCw className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.05] tracking-tight">
                CONTEÚDO SEMPRE EM MOVIMENTO
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                O Jornal da Pátria acompanha os acontecimentos e recebe novos
                conteúdos regularmente, mantendo sua experiência atualizada.
              </p>
              <span className="mt-8 block h-px w-20 gold-rule" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <SectionHeading
              eyebrow="Atualizações"
              title="ACOMPANHE O QUE ACONTECE NO BRASIL"
              description="Nossa equipe editorial acompanha os principais acontecimentos para trazer informação organizada e contexto aos leitores."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Notícias organizadas",
                "Contexto breve por trás das notícias",
                "Atualizações frequentes",
                "Fontes citadas nas matérias",
              ].map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-sm border border-border bg-navy/40 px-4 py-3"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: i % 2 === 0 ? "var(--primary)" : "var(--accent)",
                    }}
                  />
                  <span className="text-sm text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
