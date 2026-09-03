import { Reveal } from "@/components/jornal/Reveal";

export function OfferUrgency() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-lg px-6 py-12 sm:px-10 lg:px-16 lg:py-16"
            style={{
              backgroundImage:
                "linear-gradient(150deg, color-mix(in oklab, var(--gold-soft) 92%, white), var(--gold) 45%, color-mix(in oklab, var(--gold) 82%, var(--navy) 8%))",
              border: "1px solid color-mix(in oklab, var(--navy) 22%, transparent)",
              boxShadow:
                "0 24px 60px -34px color-mix(in oklab, var(--gold) 45%, transparent), inset 0 1px 0 color-mix(in oklab, white 45%, transparent)",
            }}
          >
            {/* detalhes geométricos discretos */}
            <span
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rotate-45 rounded-lg opacity-[0.07]"
              style={{ backgroundColor: "var(--navy-deep)" }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent, var(--navy-deep), transparent)",
              }}
              aria-hidden
            />

            <div className="relative mx-auto max-w-3xl text-center">
              <span
                className="eyebrow inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                style={{
                  color: "var(--navy-deep)",
                  border:
                    "1px solid color-mix(in oklab, var(--navy-deep) 35%, transparent)",
                  backgroundColor: "color-mix(in oklab, white 32%, transparent)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full"
                  style={{ backgroundColor: "oklch(0.42 0.12 152)" }}
                />
                Fique informado 🇧🇷
              </span>

              <h2
                className="mt-7 max-w-2xl mx-auto font-sans text-[clamp(1.7rem,4.6vw,3.1rem)] font-bold leading-[1.1] text-balance-editorial"
                style={{ color: "var(--navy-deep)" }}
              >
                VOCÊ NÃO PODE FICAR POR FORA DO QUE ESTÁ ACONTECENDO NO BRASIL
              </h2>

              <span
                className="mx-auto mt-7 block h-px w-24"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent, var(--navy-deep), oklch(0.42 0.12 152), transparent)",
                }}
              />

              <p
                className="mt-7 text-base leading-relaxed sm:text-lg"
                style={{ color: "color-mix(in oklab, var(--navy-deep) 82%, transparent)" }}
              >
                Todos os dias, novos acontecimentos movimentam o Brasil.
                Informação passa rápido — e quem quer acompanhar a política
                brasileira pela perspectiva da direita precisa estar atento ao
                que está acontecendo.
              </p>

              <p
                className="mt-5 font-sans text-[clamp(1.05rem,2.4vw,1.4rem)] font-bold leading-snug"
                style={{ color: "var(--navy-deep)" }}
              >
                Não espere ouvir sobre os acontecimentos depois que todo mundo já
                estiver falando deles.
              </p>

              <p
                className="mt-5 text-sm leading-relaxed sm:text-base"
                style={{ color: "color-mix(in oklab, var(--navy-deep) 78%, transparent)" }}
              >
                Conheça o Jornal da Pátria e continue acompanhando as principais
                notícias e contextos do Brasil pela nossa perspectiva editorial.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
