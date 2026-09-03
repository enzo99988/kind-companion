import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Tags } from "lucide-react";
import { listAllArticles, listCategories } from "@/lib/articles";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Editorias do Jornal da Pátria e a quantidade de notícias cadastradas em cada uma.",
      },
      { property: "og:title", content: "Categorias — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Editorias usadas na classificação das notícias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminCategorias,
});

function AdminCategorias() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });
  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles", {}],
    queryFn: () => listAllArticles(),
  });

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Organização"
        title="Categorias"
        description="Editorias disponíveis para classificar as notícias. Elas ficam armazenadas no banco de dados do projeto."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const total = articles.filter((a) => a.category_id === c.id).length;
          const published = articles.filter(
            (a) => a.category_id === c.id && a.status === "published",
          ).length;
          return (
            <div key={c.id} className="app-card rounded-lg p-5">
              <span className="inline-grid h-9 w-9 place-items-center rounded-sm bg-primary/10 text-primary">
                <Tags className="h-4 w-4" />
              </span>
              <h2 className="mt-4 font-display text-lg tracking-tight">{c.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">/{c.slug}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {total} notícia(s) · {published} publicada(s)
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
