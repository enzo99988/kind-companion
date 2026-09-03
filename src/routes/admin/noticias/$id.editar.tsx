import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import {
  getArticleById,
  listCategories,
  updateArticle,
  type ArticleFormValues,
} from "@/lib/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/noticias/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar notícia — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Edite os campos, o status e o destaque de uma notícia do Jornal da Pátria.",
      },
      { property: "og:title", content: "Editar notícia — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Edição editorial de notícias do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditarNoticia,
});

function EditarNoticia() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });
  const { data: article, isPending } = useQuery({
    queryKey: ["admin-article", id],
    queryFn: () => getArticleById(id),
  });

  async function handleSubmit(values: ArticleFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await updateArticle(id, values);
      void queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-article", id] });
      void queryClient.invalidateQueries({ queryKey: ["published-articles"] });
      navigate({ to: "/admin/noticias" });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível salvar a notícia.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Carregando notícia…</p>;
  }

  if (!article) {
    return (
      <div className="app-card rounded-lg p-8 text-center">
        <p className="font-display text-xl tracking-tight">
          Notícia não encontrada
        </p>
        <Link
          to="/admin/noticias"
          className="press mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para notícias
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Editar notícia"
        description="Alterar e salvar mantém o status atual da notícia, a menos que você escolha outro."
      />
      <ArticleForm
        key={article.id}
        categories={categories}
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        initial={{
          title: article.title,
          summary: article.summary,
          content: article.content,
          category_id: article.category_id,
          cover_image_url: article.cover_image_url,
          sources: article.sources,
          status: article.status,
          featured: article.featured,
          send_as_notification: article.send_as_notification,
          published_at: article.published_at,
        }}
      />
    </div>
  );
}
