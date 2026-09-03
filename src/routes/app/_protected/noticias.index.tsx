import { AccessGate } from "@/components/app/AccessGate";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCategories, listPublishedArticles } from "@/lib/articles";
import { ArticleCard, EmptyNewsState } from "@/components/app/news";
import { cn } from "@/lib/utils";

type Search = { categoria?: string };

export const Route = createFileRoute("/app/_protected/noticias/")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const value = search["categoria"];
    return typeof value === "string" && value ? { categoria: value } : {};
  },
  head: () => ({
    meta: [
      { title: "Notícias — Área do leitor | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Notícias do Jornal da Pátria organizadas por editoria, com resumo, contexto breve e fontes.",
      },
      { property: "og:title", content: "Notícias — Área do leitor" },
      {
        property: "og:description",
        content: "Notícias do Jornal da Pátria organizadas por editoria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AccessGate>
      <NoticiasPage />
    </AccessGate>
  ),
});

function NoticiasPage() {
  const { categoria } = Route.useSearch();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const { data: list = [], isPending } = useQuery({
    queryKey: ["published-articles", categoria ?? null],
    queryFn: () => listPublishedArticles(categoria),
  });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <span className="text-[0.62rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
          Notícias
        </span>
        <h1 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          O Brasil em contexto
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Cada publicação segue a mesma estrutura: título, resumo, conteúdo e
          fontes citadas.
        </p>
      </header>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2.5 pb-1 sm:w-auto sm:flex-wrap">
          <Link
            to="/app/noticias"
            className={cn(
              "press shrink-0 rounded-sm border px-4 py-2.5 text-[0.64rem] font-bold tracking-[0.14em] uppercase",
              !categoria
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/75 hover:text-primary",
            )}
          >
            Todas
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/app/noticias"
              search={{ categoria: cat.slug }}
              className={cn(
                "press shrink-0 rounded-sm border px-4 py-2.5 text-[0.64rem] font-bold tracking-[0.14em] uppercase",
                categoria === cat.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/75 hover:text-primary",
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Carregando notícias…</p>
      ) : list.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <EmptyNewsState
          title={
            categoria
              ? "Nenhuma notícia nesta editoria"
              : "Nenhuma notícia publicada"
          }
          description="As publicações aparecerão aqui assim que forem publicadas pela redação no painel editorial."
        />
      )}
    </div>
  );
}
