import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, FileEdit, PlusCircle, Search, Star, Trash2 } from "lucide-react";
import {
  deleteArticle,
  formatDate,
  formatDateTime,
  listAllArticles,
  listCategories,
  setArticleFeatured,
  setArticleStatus,
  STATUS_LABEL,
  STATUS_ORDER,
  type AdminFilters,
  type ArticleStatus,
} from "@/lib/articles";
import { AdminPageHeader, StatusPill } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/noticias/")({
  head: () => ({
    meta: [
      { title: "Gerenciar notícias — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Liste, filtre, edite, publique ou exclua as notícias do Jornal da Pátria.",
      },
      { property: "og:title", content: "Gerenciar notícias — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Gerenciamento editorial das notícias do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminNoticias,
});

const control =
  "rounded-sm border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary/60";

function AdminNoticias() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<AdminFilters>({
    search: "",
    status: "all",
    categoryId: "all",
    featured: "all",
    period: "all",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });
  const { data: articles = [], isPending } = useQuery({
    queryKey: ["admin-articles", filters],
    queryFn: () => listAllArticles(filters),
  });

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    void queryClient.invalidateQueries({ queryKey: ["published-articles"] });
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ArticleStatus }) =>
      setArticleStatus(id, status),
    onSuccess: refresh,
  });
  const featuredMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      setArticleFeatured(id, featured),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: refresh,
  });

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Notícias"
        description="Todas as notícias cadastradas, com filtros por categoria, status, destaque e período."
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

      <div className="app-card grid gap-3 rounded-lg p-4 sm:grid-cols-2 xl:grid-cols-5">
        <label className="relative sm:col-span-2 xl:col-span-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Buscar por título"
            aria-label="Buscar por título"
            className={`${control} w-full pl-9`}
          />
        </label>
        <select
          value={filters.categoryId}
          aria-label="Filtrar por categoria"
          onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
          className={control}
        >
          <option value="all">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          aria-label="Filtrar por status"
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: e.target.value as ArticleStatus | "all",
            }))
          }
          className={control}
        >
          <option value="all">Todos os status</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          value={filters.featured}
          aria-label="Filtrar por destaque"
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              featured: e.target.value as "all" | "yes" | "no",
            }))
          }
          className={control}
        >
          <option value="all">Destaque: todos</option>
          <option value="yes">Somente destaque</option>
          <option value="no">Sem destaque</option>
        </select>
        <select
          value={filters.period}
          aria-label="Filtrar por período"
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              period: e.target.value as NonNullable<AdminFilters["period"]>,
            }))
          }
          className={control}
        >
          <option value="all">Todo o período</option>
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
        </select>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Carregando notícias…</p>
      ) : articles.length ? (
        <div className="flex flex-col gap-3">
          {articles.map((a) => (
            <article key={a.id} className="app-card rounded-lg p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={a.status} />
                <span className="rounded-sm border border-border bg-secondary px-2.5 py-1 text-[0.56rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  {a.category?.name ?? "Sem categoria"}
                </span>
                {a.featured && (
                  <span className="rounded-sm border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/14 px-2.5 py-1 text-[0.56rem] font-bold tracking-[0.14em] text-[color:var(--gold-ink)] uppercase">
                    Destaque
                  </span>
                )}
                {a.send_as_notification && (
                  <span className="rounded-sm border border-accent/40 bg-accent/10 px-2.5 py-1 text-[0.56rem] font-bold tracking-[0.14em] text-[color:var(--verde-ink)] uppercase">
                    Notificação
                  </span>
                )}
              </div>

              <h2 className="mt-3 font-display text-lg leading-snug tracking-tight sm:text-xl">
                {a.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {a.summary}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Publicação: {formatDate(a.published_at)} · Atualizada:{" "}
                {formatDateTime(a.updated_at)}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to="/admin/noticias/$id/editar"
                  params={{ id: a.id }}
                  className="press inline-flex items-center gap-1.5 rounded-sm border border-primary/40 px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-primary uppercase hover:bg-primary hover:text-primary-foreground"
                >
                  <FileEdit className="h-3.5 w-3.5" />
                  Editar
                </Link>
                {a.status === "published" && (
                  <Link
                    to="/app/noticias/$slug"
                    params={{ slug: a.slug }}
                    className="press inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-foreground/70 uppercase hover:text-primary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Visualizar
                  </Link>
                )}
                <select
                  aria-label={`Alterar status de ${a.title}`}
                  value={a.status}
                  onChange={(e) =>
                    statusMutation.mutate({
                      id: a.id,
                      status: e.target.value as ArticleStatus,
                    })
                  }
                  className="rounded-sm border border-border bg-card px-2.5 py-2 text-xs"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    featuredMutation.mutate({ id: a.id, featured: !a.featured })
                  }
                  className="press inline-flex items-center gap-1.5 rounded-sm border border-[color:var(--gold)]/50 px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-[color:var(--gold-ink)] uppercase"
                >
                  <Star className="h-3.5 w-3.5" />
                  {a.featured ? "Remover destaque" : "Destacar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Excluir definitivamente a notícia "${a.title}"?`,
                      )
                    ) {
                      deleteMutation.mutate(a.id);
                    }
                  }}
                  className="press inline-flex items-center gap-1.5 rounded-sm border border-destructive/40 px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-destructive uppercase hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="app-card rounded-lg p-8 text-center">
          <p className="font-display text-lg tracking-tight">
            Nenhuma notícia encontrada
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajuste os filtros ou cadastre uma nova notícia.
          </p>
        </div>
      )}
    </div>
  );
}
