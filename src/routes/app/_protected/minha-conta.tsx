import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/_protected/minha-conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Jornal da Pátria" },
      {
        name: "description",
        content:
          "Veja os dados da sua conta do Jornal da Pátria e gerencie seu acesso.",
      },
      { property: "og:title", content: "Minha conta — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Dados da sua conta do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinhaContaPage,
});

function MinhaContaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email, account_status")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/app/login", replace: true });
  }

  const name =
    profile?.display_name?.trim() ||
    (user?.user_metadata?.["display_name"] as string | undefined) ||
    "Leitor";
  const email = profile?.email ?? user?.email ?? "—";
  const initials = name.trim().charAt(0).toUpperCase() || "L";

  const rows: Array<{ label: string; value: string; note?: string }> = [
    { label: "Nome", value: name },
    { label: "E-mail", value: email },
    {
      label: "Status da conta",
      value: "Conta de teste",
      note: "Status provisório desta etapa do produto.",
    },
    {
      label: "Plano",
      value: "Não definido",
      note: "O plano será exibido quando a assinatura for ativada.",
    },
    {
      label: "Validade do acesso",
      value: "Não disponível",
      note: "A data de expiração aparecerá aqui após a ativação da assinatura.",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="app-card relative overflow-hidden rounded-lg p-6 sm:p-8">
        <span className="absolute inset-x-0 top-0 h-1 brasil-rule" />
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary font-display text-2xl text-primary-foreground">
            {initials}
          </span>
          <div className="min-w-0">
            <span className="block text-[0.6rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
              Painel do assinante
            </span>
            <h1 className="mt-2 truncate font-display text-2xl leading-tight tracking-tight sm:text-3xl">
              {name}
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {email}
            </p>
          </div>
        </div>
      </header>

      <section className="app-card rounded-lg p-6 sm:p-8">
        <h2 className="text-[0.66rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Dados da conta
        </h2>
        <dl className="mt-5 flex flex-col divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="min-w-44 text-[0.64rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                {row.label}
              </dt>
              <dd className="min-w-0 text-base break-words text-foreground">
                {row.value}
                {row.note ? (
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {row.note}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="app-card rounded-lg p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.2em] text-[color:var(--gold-ink)] uppercase">
          <ShieldCheck className="h-4 w-4" />
          Assinatura
        </span>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Esta área exibirá plano, data de início, data de expiração e status da
          assinatura quando o sistema de pagamento for ativado.
        </p>
      </section>

      <div>
        <button
          type="button"
          onClick={handleSignOut}
          className="press inline-flex w-full items-center justify-center gap-2 rounded-sm border border-primary/50 px-6 py-4 text-[0.72rem] font-bold tracking-[0.16em] text-primary uppercase hover:bg-primary hover:text-primary-foreground sm:w-auto"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </div>
    </div>
  );
}
