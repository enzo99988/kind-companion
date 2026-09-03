import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import {
  deriveAccessStatus,
  getMyAccess,
  ACCESS_LABEL,
} from "@/lib/reader-access";
import { formatDate } from "@/lib/articles";

/**
 * Libera o conteúdo exclusivo somente para leitores com acesso ativo.
 * O bloqueio real é aplicado pelas políticas do banco de dados; esta camada
 * apenas exibe a mensagem adequada.
 */
export function AccessGate({ children }: { children: ReactNode }) {
  const { data, isPending } = useQuery({
    queryKey: ["my-reader-access"],
    queryFn: getMyAccess,
  });

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground">Verificando seu acesso…</p>
    );
  }

  const status = deriveAccessStatus(data);
  if (status === "active") return <>{children}</>;

  return (
    <div className="app-card relative overflow-hidden rounded-lg p-8 text-center sm:p-12">
      <span className="absolute inset-x-0 top-0 h-1 brasil-rule" />
      <span className="inline-grid h-12 w-12 place-items-center rounded-sm bg-primary/10 text-primary">
        <Lock className="h-5 w-5" />
      </span>
      <p className="mt-5 text-[0.62rem] font-bold tracking-[0.22em] text-muted-foreground uppercase">
        {ACCESS_LABEL[status]}
      </p>
      <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
        {status === "expired"
          ? "Seu acesso ao conteúdo exclusivo expirou"
          : "Seu acesso ao conteúdo exclusivo ainda não está ativo"}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {status === "expired" ? (
          <>
            O período de acesso terminou em{" "}
            <strong>{formatDate(data?.ends_at ?? null)}</strong>. Para voltar a
            ler as notícias do Jornal da Pátria, é necessário reativar o acesso.
          </>
        ) : (
          <>
            Sua conta está criada e o login funciona normalmente, mas o conteúdo
            exclusivo do Jornal da Pátria só aparece quando o acesso estiver
            ativo.
          </>
        )}
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/oferta"
          className="press rounded-sm bg-primary px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase"
        >
          Conhecer o Jornal da Pátria
        </Link>
        <Link
          to="/app/minha-conta"
          className="press rounded-sm border border-border bg-card px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] uppercase"
        >
          Minha conta
        </Link>
      </div>
    </div>
  );
}
