import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/assinaturas")({
  head: () => ({
    meta: [
      { title: "Assinaturas — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Área preparada para o acompanhamento das assinaturas do Jornal da Pátria.",
      },
      { property: "og:title", content: "Assinaturas — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Acompanhamento de assinaturas do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminAssinaturas,
});

function AdminAssinaturas() {
  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Receita"
        title="Assinaturas"
        description="Seção reservada. O checkout atual permanece como está e nada foi alterado nesta etapa."
      />
      <div className="app-card rounded-lg p-8 text-center">
        <span className="inline-grid h-11 w-11 place-items-center rounded-sm bg-accent/12 text-[color:var(--verde-ink)]">
          <CreditCard className="h-5 w-5" />
        </span>
        <p className="mt-4 font-display text-lg tracking-tight">
          Em preparação
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          O acompanhamento de planos e pagamentos será conectado quando o
          checkout for ativado.
        </p>
      </div>
    </div>
  );
}
