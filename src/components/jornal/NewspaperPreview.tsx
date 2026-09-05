import { Headphones, LayoutGrid, Newspaper } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import artigoShot from "@/assets/showcase/leitor-artigo.jpg";
import noticiasShot from "@/assets/showcase/leitor-noticias.jpg";
import mobileShot from "@/assets/showcase/leitor-mobile.jpg";

const HIGHLIGHTS = [
  {
    icon: Newspaper,
    title: "Leitura completa",
    note: "Título, resumo, conteúdo e fontes citadas em cada publicação.",
  },
  {
    icon: Headphones,
    title: "Ouvir a notícia",
    note: "Player de áudio disponível dentro da própria matéria.",
  },
  {
    icon: LayoutGrid,
    title: "Categorias",
    note: "Filtros por temas como Brasil, Economia, Governo e Análises.",
  },
];

export function NewspaperPreview() {
  return (
    <section className="relative border-t border-border section-y">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--azul)_16%,transparent),transparent_75%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Área do Leitor"
          title="VEJA O JORNAL POR DENTRO"
          description="Telas reais da Área do Leitor: notícias, categorias, conteúdo e o player de áudio das matérias."
        />

        {/* main showcase: desktop frame + phone frame */}
        <Reveal className="relative mt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.62fr)] lg:items-end">
            {/* desktop frame */}
            <figure className="overflow-hidden rounded-xl border border-border bg-navy/60 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border bg-navy-deep/80 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
                <span className="ml-4 truncate rounded-sm border border-border px-3 py-1 text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
                  jornaldapatria — área do leitor
                </span>
              </div>
              <img
                src={artigoShot}
                alt="Tela real de uma notícia na Área do Leitor com o player de áudio Ouvir notícia"
                loading="lazy"
                className="block w-full"
              />
              <figcaption className="border-t border-border px-6 py-5 text-sm text-muted-foreground">
                Notícia aberta no computador, com o player{" "}
                <span className="text-accent">Ouvir notícia</span> acima do
                conteúdo.
              </figcaption>
            </figure>

            {/* phone frame */}
            <figure className="mx-auto w-[248px] sm:w-[268px]">
              <div className="relative rounded-[2.4rem] border border-border bg-navy-deep/90 p-3 shadow-2xl">
                <span
                  aria-hidden
                  className="absolute top-3 left-1/2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-foreground/15"
                />
                <img
                  src={mobileShot}
                  alt="Tela real da leitura de uma notícia no celular, com player de áudio e menu inferior"
                  loading="lazy"
                  className="block w-full rounded-[1.9rem]"
                />
              </div>
              <figcaption className="mt-5 text-center text-sm text-muted-foreground">
                A mesma leitura no celular.
              </figcaption>
            </figure>
          </div>
        </Reveal>

        {/* secondary shot + highlights */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <Reveal delay={100}>
            <figure className="overflow-hidden rounded-xl border border-border bg-navy/60 shadow-xl">
              <img
                src={noticiasShot}
                alt="Tela real da lista de notícias da Área do Leitor com filtros por categoria"
                loading="lazy"
                className="block w-full"
              />
              <figcaption className="border-t border-border px-6 py-5 text-sm text-muted-foreground">
                Lista de notícias com filtros por categoria.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={180} className="grid gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, note }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-lg surface-card card-hover p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-primary/40 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-lg">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
