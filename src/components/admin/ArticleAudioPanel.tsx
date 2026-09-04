import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, Headphones, Loader2, RefreshCw, Trash2 } from "lucide-react";
import {
  deleteArticleAudio,
  generateArticleAudio,
} from "@/lib/article-audio.functions";
import { formatDateTime } from "@/lib/articles";

const STATUS_LABEL: Record<string, string> = {
  none: "Sem áudio",
  generating: "Gerando…",
  ready: "Áudio pronto",
  stale: "Áudio desatualizado",
  error: "Falha na geração",
};

export function ArticleAudioPanel({
  articleId,
  status,
  generatedAt,
  audioError,
}: {
  articleId: string;
  status: string;
  generatedAt: string | null;
  audioError: string | null;
}) {
  const queryClient = useQueryClient();
  const generate = useServerFn(generateArticleAudio);
  const remove = useServerFn(deleteArticleAudio);
  const [busy, setBusy] = useState<"generate" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: "generate" | "delete") {
    setBusy(action);
    setError(null);
    try {
      if (action === "generate") await generate({ data: { articleId } });
      else await remove({ data: { articleId } });
      await queryClient.invalidateQueries({
        queryKey: ["admin-article", articleId],
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      await queryClient.invalidateQueries({ queryKey: ["article-audio"] });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível concluir a ação.",
      );
    } finally {
      setBusy(null);
    }
  }

  const shown = error ?? (status === "error" ? audioError : null);

  return (
    <div className="app-card flex flex-col gap-4 rounded-lg p-5">
      <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
        <Headphones className="h-4 w-4" />
        Áudio da notícia
      </div>

      <div className="text-sm">
        <span className="font-semibold">
          {STATUS_LABEL[status] ?? "Sem áudio"}
        </span>
        {status === "stale" && (
          <span className="mt-1 block text-xs text-muted-foreground">
            O texto mudou depois da última geração. Gere novamente para o leitor
            ouvir a versão atual.
          </span>
        )}
        {generatedAt && (
          <span className="mt-1 block text-xs text-muted-foreground">
            Gerado em {formatDateTime(generatedAt)}
          </span>
        )}
      </div>

      {shown && (
        <p className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/8 px-3 py-2.5 text-xs text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {shown}
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void run("generate")}
          className="press inline-flex items-center justify-center gap-2 rounded-sm border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/12 px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-[color:var(--gold-ink)] uppercase disabled:opacity-60"
        >
          {busy === "generate" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {status === "ready" || status === "stale"
            ? "Regenerar áudio"
            : "Gerar áudio"}
        </button>
        {status !== "none" && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void run("delete")}
            className="press inline-flex items-center justify-center gap-2 rounded-sm border border-border px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-foreground/75 uppercase disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Remover áudio
          </button>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Salve as alterações do texto antes de gerar o áudio.
        </p>
      </div>
    </div>
  );
}
