import { useState } from "react";
import { AlertCircle, Loader2, Save, Send, Upload } from "lucide-react";
import type {
  ArticleFormValues,
  ArticleStatus,
  CategoryRow,
} from "@/lib/articles";

const label =
  "block text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase";
const field =
  "mt-2 w-full rounded-sm border border-border bg-card px-3.5 py-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15";

export type ArticleFormProps = {
  initial?: Partial<ArticleFormValues>;
  categories: CategoryRow[];
  submitting: boolean;
  error?: string | null;
  onSubmit: (values: ArticleFormValues, status: ArticleStatus) => void;
};

export function ArticleForm({
  initial,
  categories,
  submitting,
  error,
  onSubmit,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [cover, setCover] = useState(initial?.cover_image_url ?? "");
  const [sources, setSources] = useState(initial?.sources ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [notify, setNotify] = useState(initial?.send_as_notification ?? false);
  const [audioEnabled, setAudioEnabled] = useState(
    initial?.audio_enabled ?? false,
  );
  const [publishedAt, setPublishedAt] = useState(
    initial?.published_at ? initial.published_at.slice(0, 10) : "",
  );
  const [localError, setLocalError] = useState<string | null>(null);

  function handle(status: ArticleStatus) {
    if (title.trim().length < 6) {
      setLocalError("Informe um título com pelo menos 6 caracteres.");
      return;
    }
    if (!categoryId) {
      setLocalError("Selecione uma categoria.");
      return;
    }
    if (summary.trim().length < 20) {
      setLocalError("O resumo precisa ter pelo menos 20 caracteres.");
      return;
    }
    if (status !== "draft" && content.trim().length < 50) {
      setLocalError(
        "O conteúdo precisa ter pelo menos 50 caracteres para enviar à revisão ou publicar.",
      );
      return;
    }
    if (status === "published" && !sources.trim()) {
      setLocalError("Informe as fontes antes de publicar.");
      return;
    }
    setLocalError(null);
    onSubmit(
      {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category_id: categoryId,
        cover_image_url: cover.trim() || null,
        sources: sources.trim(),
        status,
        featured,
        send_as_notification: notify,
        audio_enabled: audioEnabled,
        published_at: publishedAt
          ? new Date(`${publishedAt}T12:00:00`).toISOString()
          : null,
      },
      status,
    );
  }

  const shown = localError ?? error;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      <div className="flex flex-col gap-5">
        <div className="app-card rounded-lg p-5 sm:p-6">
          <div>
            <label className={label} htmlFor="title">
              Título
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={180}
              className={field}
              placeholder="Título da notícia"
            />
          </div>
          <div className="mt-5">
            <label className={label} htmlFor="summary">
              Resumo
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={600}
              rows={3}
              className={field}
              placeholder="Resumo objetivo do acontecimento"
            />
          </div>
          <div className="mt-5">
            <label className={label} htmlFor="content">
              Conteúdo completo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className={`${field} leading-relaxed`}
              placeholder="Texto da notícia. Separe os parágrafos com uma linha em branco."
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Separe os parágrafos com uma linha em branco.
            </p>
          </div>
          <div className="mt-5">
            <label className={label} htmlFor="sources">
              Fontes
            </label>
            <textarea
              id="sources"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              rows={3}
              className={field}
              placeholder="Uma fonte por linha (nome e link, quando houver)."
            />
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-5">
        <div className="app-card rounded-lg p-5">
          <label className={label} htmlFor="category">
            Categoria
          </label>
          <select
            id="category"
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value)}
            className={field}
          >
            <option value="">Selecione…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="mt-5">
            <label className={label} htmlFor="cover">
              Imagem de capa (URL)
            </label>
            <input
              id="cover"
              value={cover ?? ""}
              onChange={(e) => setCover(e.target.value)}
              className={field}
              placeholder="https://…"
            />
            {cover ? (
              <img
                src={cover}
                alt="Pré-visualização da imagem de capa"
                className="mt-3 aspect-[16/9] w-full rounded-sm border border-border object-cover"
              />
            ) : (
              <div className="mt-3 flex aspect-[16/9] w-full items-center justify-center gap-2 rounded-sm border border-dashed border-border text-xs text-muted-foreground">
                <Upload className="h-4 w-4" />
                Sem imagem
              </div>
            )}
          </div>

          <div className="mt-5">
            <label className={label} htmlFor="published_at">
              Data de publicação
            </label>
            <input
              id="published_at"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={field}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Se ficar vazio, usamos a data em que a notícia for publicada.
            </p>
          </div>
        </div>

        <div className="app-card flex flex-col gap-4 rounded-lg p-5">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[color:var(--gold)]"
            />
            <span>
              <span className="font-semibold">Destacar notícia</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Apenas uma notícia fica em destaque: a anterior perde o destaque
                automaticamente.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[color:var(--gold)]"
            />
            <span>
              <span className="font-semibold">Disponibilizar áudio</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Permite gerar a narração em voz de IA para esta notícia. Desmarque
                para deixá-la sem áudio.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[color:var(--gold)]"
            />
            <span>
              <span className="font-semibold">Enviar como notificação</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Estrutura preparada. O envio externo será ativado em uma próxima
                etapa.
              </span>
            </span>
          </label>
        </div>

        {shown && (
          <p className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/8 px-3.5 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {shown}
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handle("published")}
            className="press inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3.5 text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Publicar
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handle("review")}
            className="press inline-flex items-center justify-center gap-2 rounded-sm border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/12 px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-[color:var(--gold-ink)] uppercase disabled:opacity-60"
          >
            Enviar para revisão
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handle("draft")}
            className="press inline-flex items-center justify-center gap-2 rounded-sm border border-border px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-foreground/75 uppercase disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            Salvar rascunho
          </button>
        </div>
      </aside>
    </form>
  );
}
