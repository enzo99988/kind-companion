import { AccessGate } from "@/components/app/AccessGate";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import { formatDate, getPublishedArticleBySlug } from "@/lib/articles";
import { CategoryTag } from "@/components/app/news";
import { ArticleAudioPlayer } from "@/components/app/ArticleAudioPlayer";


export const Route = createFileRoute("/app/_protected/noticias/$slug")({
  head: () => ({
    meta: [
      { title: "Leitura — Área do leitor | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Área de leitura do Jornal da Pátria: título, resumo, conteúdo e fontes citadas.",
      },
      { property: "og:title", content: "Leitura — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Área de leitura do Jornal da Pátria.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AccessGate>
      <LeituraPage />
    </AccessGate>
  ),
});

function LeituraPage() {
  const { slug } = Route.useParams();
  const { data: article, isPending } = useQuery({
    queryKey: ["published-article", slug],
    queryFn: () => getPublishedArticleBySlug(slug),
  });

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Carregando notícia…</p>;
  }

  if (!article) {
    return (
      <div className="app-card rounded-lg p-8 text-center">
        <h1 className="font-display text-2xl tracking-tight">
          Publicação não encontrada
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Este endereço não corresponde a nenhuma notícia publicada.
        </p>
        <Link
          to="/app/noticias"
          className="press mt-6 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para notícias
        </Link>
      </div>
    );
  }

  const paragraphs = article.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const sources = article.sources
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col">
      <Link
        to="/app/noticias"
        className="press inline-flex items-center gap-2 self-start text-[0.66rem] font-bold tracking-[0.16em] text-muted-foreground uppercase hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Notícias
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {article.category && (
          <CategoryTag
            name={article.category.name}
            tone={article.category.tone}
          />
        )}
        {article.featured && (
          <span className="inline-flex items-center rounded-sm border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/14 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.16em] text-[color:var(--gold-ink)] uppercase">
            Destaque
          </span>
        )}
      </div>

      <h1 className="mt-4 font-display text-[clamp(1.8rem,5vw,2.9rem)] leading-[1.08] tracking-tight text-balance-editorial">
        {article.title}
      </h1>

      <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
        {article.summary}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.68rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(article.published_at ?? article.created_at)}
        </span>
        {article.author_name && <span>{article.author_name}</span>}
      </div>

      <ArticleAudioPlayer slug={slug} />


      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary text-muted-foreground">
            <Newspaper className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-5 text-[1.02rem] leading-[1.75] text-foreground/85">
        {paragraphs.map((p, i) => (
          <p key={`${i}-${p.slice(0, 16)}`}>{p}</p>
        ))}
      </div>

      <section className="app-card mt-10 rounded-lg p-6">
        <h2 className="text-[0.66rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Fontes
        </h2>
        {sources.length ? (
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-foreground/80">
            {sources.map((s, i) => (
              <li key={`${i}-${s.slice(0, 16)}`}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Nenhuma fonte informada para esta publicação.
          </p>
        )}
      </section>
    </article>
  );
}
