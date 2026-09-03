import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileEdit, Newspaper, Eye, CheckCircle2, PlusCircle } from "lucide-react";
import {
  formatDate,
  formatDateTime,
  listAllArticles,
  type ArticleWithCategory,
} from "@/lib/articles";
import { AdminPageHeader, StatusPill } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard editorial — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Painel editorial do Jornal da Pátria: totais de notícias, rascunhos, revisões e publicações recentes.",
      },
      { property: "og:title", content: "Dashboard editorial — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Visão geral do gerenciamento de notícias do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Newspaper;
  tone: string;
}) {
  return (
    <div className="app-card rounded-lg p-5">
      <span className={`inline-grid h-9 w-9 place-items-center rounded-sm ${tone}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 font-display text-3xl leading-none tracking-tight">{value}</p>
      <p className="mt-2 text-[0.62rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

function AdminDashboard() {
  const { data: articles = [], isPending } = useQuery({
    queryKey: ["admin-articles", {}],
    queryFn: () => listAllArticles(),
  });

  const total = articles.length;
  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");
  const review = articles.filter((a) => a.status === "review");
  const latest = articles.slice(0, 8);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Bastidor editorial"
        title="Dashboard"
        description="Acompanhe o andamento da produção de conteúdo do Jornal da Pátria."
        action={
          <Link
            to="/admin/noticias/nova"
            className="press inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase"
          >
            <PlusCircle className="h-4 w-4" />
            Nova notícia
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total de notícias" value={total} icon={Newspaper} tone="bg-primary/10 text-primary" />
        <Stat
          label="Publicadas"
          value={published.length}
          icon={CheckCircle2}
          tone="bg-accent/12 text-[color:var(--verde-ink)]"
        />
        <Stat label="Rascunhos" value={drafts.length} icon={FileEdit} tone="bg-secondary text-muted-foreground" />
        <Stat
          label="Em revisão"
          value={review.length}
          icon={Eye}
          tone="bg-[color:var(--gold)]/15 text-[color:var(--gold-ink)]"
        />
      </section>

      <section>
        <h2 className="font-display text-xl tracking-tight sm:text-2xl">
          Publicadas recentemente
        </h2>
        {published.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {published.slice(0, 3).map((a) => (
              <li key={a.id} className="app-card rounded-lg p-4">
                <StatusPill status={a.status} />
                <p className="mt-3 font-display text-base leading-snug tracking-tight">
                  {a.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {a.category?.name ?? "Sem categoria"} · {formatDate(a.published_at)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhuma notícia publicada ainda.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl tracking-tight sm:text-2xl">
          Últimas notícias cadastradas
        </h2>
        {isPending ? (
          <p className="mt-3 text-sm text-muted-foreground">Carregando…</p>
        ) : latest.length ? (
          <AdminArticleTable articles={latest} />
        ) : (
          <div className="app-card mt-4 rounded-lg p-8 text-center">
            <p className="font-display text-lg tracking-tight">
              Nenhuma notícia cadastrada
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece cadastrando a primeira notícia real do Jornal da Pátria.
            </p>
            <Link
              to="/admin/noticias/nova"
              className="press mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase"
            >
              <PlusCircle className="h-4 w-4" />
              Nova notícia
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function AdminArticleTable({ articles }: { articles: ArticleWithCategory[] }) {
  return (
    <div className="app-card mt-4 overflow-x-auto rounded-lg">
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-[0.58rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Publicação</th>
            <th className="px-4 py-3">Atualizada</th>
            <th className="px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-b border-border/60 last:border-0">
              <td className="max-w-[18rem] px-4 py-3 font-semibold">
                <span className="line-clamp-2">{a.title}</span>
                {a.featured && (
                  <span className="mt-1 inline-flex rounded-sm border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/14 px-2 py-0.5 text-[0.52rem] font-bold tracking-[0.14em] text-[color:var(--gold-ink)] uppercase">
                    Destaque
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {a.category?.name ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusPill status={a.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(a.published_at)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDateTime(a.updated_at)}
              </td>
              <td className="px-4 py-3">
                <Link
                  to="/admin/noticias/$id/editar"
                  params={{ id: a.id }}
                  className="press inline-flex items-center gap-1.5 rounded-sm border border-primary/40 px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.12em] text-primary uppercase hover:bg-primary hover:text-primary-foreground"
                >
                  <FileEdit className="h-3.5 w-3.5" />
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
