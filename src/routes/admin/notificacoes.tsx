import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, FileEdit, Plus, Trash2, X } from "lucide-react";
import { formatDateTime, listAllArticles } from "@/lib/articles";
import {
  createNotification,
  deleteNotification,
  listNotifications,
  updateNotification,
  type NotificationInput,
  type NotificationWithArticle,
} from "@/lib/notifications";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Crie, edite e publique notificações para os leitores do Jornal da Pátria.",
      },
      { property: "og:title", content: "Notificações — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Gestão de notificações editoriais do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminNotificacoes,
});

const EMPTY: NotificationInput = {
  title: "",
  message: "",
  article_id: null,
  is_active: true,
};

function AdminNotificacoes() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<NotificationWithArticle | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<NotificationInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: listNotifications,
  });
  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles", {}],
    queryFn: () => listAllArticles(),
  });

  function openCreate() {
    setForm(EMPTY);
    setEditing(null);
    setError(null);
    setCreating(true);
  }

  function openEdit(n: NotificationWithArticle) {
    setForm({
      title: n.title,
      message: n.message,
      article_id: n.article_id,
      is_active: n.is_active,
    });
    setCreating(false);
    setError(null);
    setEditing(n);
  }

  function closeModal() {
    setCreating(false);
    setEditing(null);
    setError(null);
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Informe o título.");
      if (!form.message.trim()) throw new Error("Informe a mensagem.");
      const payload: NotificationInput = {
        title: form.title.trim(),
        message: form.message.trim(),
        article_id: form.article_id,
        is_active: form.is_active,
      };
      if (editing) await updateNotification(editing.id, payload);
      else await createNotification(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["reader-notifications"] });
      closeModal();
    },
    onError: (e: unknown) =>
      setError(e instanceof Error ? e.message : "Não foi possível salvar."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["reader-notifications"] });
    },
  });

  const modalOpen = creating || editing !== null;

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Distribuição"
        title="Notificações"
        description="Crie mensagens personalizadas para os leitores. Cada notificação pode estar ligada a uma notícia e pode ser ativada ou desativada."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="press inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-[0.65rem] font-bold tracking-[0.14em] text-primary-foreground uppercase"
          >
            <Plus className="h-3.5 w-3.5" />
            Nova notificação
          </button>
        }
      />

      <div className="app-card flex items-start gap-3 rounded-lg border-l-[3px] border-[color:var(--gold)] p-5">
        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold-ink)]" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          As notificações aparecem na central do leitor. Nenhum envio externo
          (push, e-mail, WhatsApp) é disparado nesta etapa, e uma notificação
          nunca libera conteúdo para quem está sem acesso.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : notifications.length ? (
        <ul className="flex flex-col gap-3">
          {notifications.map((n) => (
            <li key={n.id} className="app-card rounded-lg p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.14em] uppercase ${
                    n.is_active
                      ? "border-accent/40 bg-accent/12 text-[color:var(--verde-ink)]"
                      : "border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  {n.is_active ? "Ativa" : "Inativa"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Criada: {formatDateTime(n.created_at)}
                </span>
              </div>
              <p className="mt-3 font-display text-lg leading-snug tracking-tight">
                {n.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {n.message}
              </p>
              {n.article && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Notícia relacionada:{" "}
                  <span className="font-semibold text-foreground">
                    {n.article.title}
                  </span>
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(n)}
                  className="press inline-flex items-center gap-1.5 rounded-sm border border-primary/40 px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-primary uppercase hover:bg-primary hover:text-primary-foreground"
                >
                  <FileEdit className="h-3.5 w-3.5" />
                  Editar
                </button>
                {confirmDelete === n.id ? (
                  <span className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => remove.mutate(n.id)}
                      disabled={remove.isPending}
                      className="press inline-flex items-center gap-1.5 rounded-sm bg-destructive px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-destructive-foreground uppercase disabled:opacity-60"
                    >
                      Confirmar exclusão
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="press rounded-sm border border-border px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground uppercase"
                    >
                      Cancelar
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(n.id)}
                    className="press inline-flex items-center gap-1.5 rounded-sm border border-destructive/40 px-3 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-destructive uppercase hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="app-card rounded-lg p-8 text-center">
          <p className="font-display text-lg tracking-tight">
            Nenhuma notificação criada
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Clique em “Nova notificação” para escrever a primeira mensagem aos
            leitores.
          </p>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/45 p-0 sm:items-center sm:p-6">
          <div className="app-card max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-lg p-5 sm:rounded-lg sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[0.6rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
                  {editing ? "Editar" : "Nova"}
                </span>
                <h2 className="mt-2 font-display text-2xl tracking-tight">
                  Notificação
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar"
                className="press grid h-9 w-9 place-items-center rounded-sm border border-border text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              className="mt-6 flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate();
              }}
            >
              <label className="flex flex-col gap-2">
                <span className="text-[0.6rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                  Título
                </span>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Nova notícia no Jornal da Pátria"
                  className="rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[0.6rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                  Mensagem
                </span>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={4}
                  placeholder="Acabamos de publicar uma nova notícia. Confira agora os principais acontecimentos."
                  className="rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[0.6rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                  Notícia relacionada (opcional)
                </span>
                <select
                  value={form.article_id ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      article_id: e.target.value || null,
                    }))
                  }
                  className="rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">Sem notícia relacionada</option>
                  {articles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                  className="h-4 w-4 accent-[color:var(--verde-ink)]"
                />
                <span className="text-sm text-foreground">
                  Notificação ativa (visível para os leitores)
                </span>
              </label>

              {error && (
                <p className="rounded-sm border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={save.isPending}
                  className="press inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-[0.65rem] font-bold tracking-[0.14em] text-primary-foreground uppercase disabled:opacity-60"
                >
                  {save.isPending ? "Salvando…" : "Salvar notificação"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="press rounded-sm border border-border px-4 py-2.5 text-[0.65rem] font-bold tracking-[0.14em] text-muted-foreground uppercase"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
