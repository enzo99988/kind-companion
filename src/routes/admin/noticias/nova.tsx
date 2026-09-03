import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createArticle,
  listCategories,
  type ArticleFormValues,
} from "@/lib/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/noticias/nova")({
  head: () => ({
    meta: [
      { title: "Nova notícia — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Cadastre uma nova notícia do Jornal da Pátria com resumo, conteúdo, categoria, capa e fontes.",
      },
      { property: "og:title", content: "Nova notícia — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Cadastro de notícias do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NovaNoticia,
});

function NovaNoticia() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  async function handleSubmit(values: ArticleFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await createArticle(values);
      void queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
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

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Nova notícia"
        description="Preencha os campos, cite as fontes e escolha se a notícia entra como rascunho, revisão ou publicação."
      />
      <ArticleForm
        categories={categories}
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
