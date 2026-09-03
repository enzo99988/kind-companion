import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/jornal/Reveal";

export function OfferGuarantee() {
  return (
    <section className="section-y border-t border-border bg-[linear-gradient(180deg,var(--navy-deep),var(--navy))]">
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal className="flex items-center justify-center gap-3">
          <span className="h-px w-10 gold-rule" />
          <span className="eyebrow text-primary">Garantia</span>
          <span className="h-px w-10 gold-rule" />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 p-4 text-accent">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-6 font-display text-[clamp(1.8rem,5vw,3rem)] leading-[1.05] tracking-tight">
            VOCÊ TEM 7 DIAS PARA DECIDIR
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Se você mudar de ideia ou entender que o produto não é adequado
            para você, existe o prazo de 7 dias para solicitar o
            cancelamento/reembolso, conforme as condições aplicáveis à compra.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
