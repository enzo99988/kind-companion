import { AccessGate } from "@/components/app/AccessGate";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Flag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { listPublishedArticles } from "@/lib/articles";
import {
  ArticleCard,
  EmptyNewsState,
  FeaturedArticle,
} from "@/components/app/news";

export const Route = createFileRoute("/app/_protected/")({
  head: () => ({
    meta: [
      { title: "Início — Área do leitor | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Painel do leitor do Jornal da Pátria: principais acontecimentos do Brasil com contexto e fontes.",
      },
      { property: "og:title", content: "Início — Área do leitor" },
      {
        property: "og:description",
        content: "Painel do leitor do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AccessGate>
      <DashboardPage />
    </AccessGate>
  ),
});

function DashboardPage() {
  const { user } = useAuth();
  const name =
    (user?.user_metadata?.["display_name"] as string | undefined)?.split(
      " ",
    )[0] ?? "leitor";

  const { data: articles = [], isPending } = useQuery({
    queryKey: ["published-articles", null],
    queryFn: () => listPublishedArticles(),
  });

  const [featured, ...rest] = articles;

  return (
    <div className="flex flex-col gap-10">
      <header className="app-card relative overflow-hidden rounded-lg p-6 sm:p-8">
        <span className="absolute inset-x-0 top-0 h-1 brasil-rule" />
        <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
          <Flag className="h-3.5 w-3.5" />
          Jornal da Pátria — Área do leitor
        </span>
        <h1 className="mt-4 font-display text-3xl leading-[1.1] tracking-tight text-balance-editorial sm:text-4xl">
          Bom retorno, {name}.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Acompanhe os acontecimentos do Brasil com resumo objetivo, contexto
          breve e fontes citadas — pela perspectiva editorial da direita
          brasileira.
        </p>
        <Link
          to="/app/noticias"
          className="press mt-6 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase hover:bg-navy"
        >
          Ver notícias
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Carregando notícias…</p>
      ) : articles.length && featured ? (
        <>
          <section className="flex flex-col gap-5">
            <h2 className="font-display text-2xl tracking-tight sm:text-[1.7rem]">
              Principais acontecimentos
            </h2>
            <FeaturedArticle article={featured} />
          </section>

          {rest.length > 0 && (
            <section className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl tracking-tight sm:text-[1.7rem]">
                  Últimas publicações
                </h2>
                <Link
                  to="/app/noticias"
                  className="press inline-flex items-center gap-2 text-[0.66rem] font-bold tracking-[0.14em] text-primary uppercase"
                >
                  Ver todas
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(0, 6).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <EmptyNewsState />
      )}
    </div>
  );
}
