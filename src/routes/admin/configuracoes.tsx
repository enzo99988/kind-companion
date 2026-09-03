import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Preferências editoriais do painel administrativo do Jornal da Pátria.",
      },
      { property: "og:title", content: "Configurações — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Preferências do painel administrativo do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminConfiguracoes,
});

function AdminConfiguracoes() {
  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Ajustes"
        title="Configurações"
        description="Seção reservada para preferências editoriais do jornal."
      />
      <div className="app-card rounded-lg p-8 text-center">
        <span className="inline-grid h-11 w-11 place-items-center rounded-sm bg-secondary text-muted-foreground">
          <Settings className="h-5 w-5" />
        </span>
        <p className="mt-4 font-display text-lg tracking-tight">Em preparação</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Nesta etapa o foco é o gerenciamento de notícias. As preferências
          gerais entram em seguida.
        </p>
      </div>
    </div>
  );
}
