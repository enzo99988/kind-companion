import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, CheckCheck, Newspaper } from "lucide-react";
import { formatDateTime } from "@/lib/articles";
import {
  listReaderNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type ReaderNotification,
} from "@/lib/notifications";

export const Route = createFileRoute("/app/_protected/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações — Área do leitor | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Central de notificações do leitor do Jornal da Pátria: avisos de novas publicações e da sua conta.",
      },
      { property: "og:title", content: "Notificações — Área do leitor" },
      {
        property: "og:description",
        content: "Central de notificações do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificacoesPage,
});

function NotificacoesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["reader-notifications"],
    queryFn: listReaderNotifications,
  });

  const unread = notifications.filter((n) => !n.read);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["reader-notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
  }

  const markOne = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: refresh,
  });

  const markAll = useMutation({
    mutationFn: () => markAllNotificationsRead(unread.map((n) => n.id)),
    onSuccess: refresh,
  });

  function handleOpen(n: ReaderNotification) {
    if (!n.read) markOne.mutate(n.id);
    if (n.article) {
      navigate({
        to: "/app/noticias/$slug",
        params: { slug: n.article.slug },
      });
      return;
    }
    setExpanded((prev) => ({ ...prev, [n.id]: !prev[n.id] }));
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <span className="text-[0.62rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
          Notificações
        </span>
        <h1 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          Central de avisos
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Aqui aparecem os avisos da redação sobre novas publicações e a sua
          conta.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-sm border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/12 px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.14em] text-[color:var(--gold-ink)] uppercase">
            <Bell className="h-3.5 w-3.5" />
            {unread.length} não lida{unread.length === 1 ? "" : "s"}
          </span>
          {unread.length > 0 && (
            <button
              type="button"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="press inline-flex items-center gap-2 rounded-sm border border-primary/40 px-3.5 py-2 text-[0.62rem] font-bold tracking-[0.13em] text-primary uppercase hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todas como lidas
            </button>
          )}
        </div>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : notifications.length ? (
        <ul className="flex flex-col gap-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`app-card rounded-lg p-5 transition ${
                n.read
                  ? "border-border"
                  : "border-l-[3px] border-l-[color:var(--gold)]"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.56rem] font-bold tracking-[0.14em] uppercase ${
                    n.read
                      ? "border-border bg-secondary text-muted-foreground"
                      : "border-accent/40 bg-accent/12 text-[color:var(--verde-ink)]"
                  }`}
                >
                  {n.read ? "Lida" : "Não lida"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(n.created_at)}
                </span>
              </div>

              <h2 className="mt-3 font-display text-xl leading-snug tracking-tight">
                {n.title}
              </h2>
              <p
                className={`mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground ${
                  n.article || expanded[n.id] ? "" : "line-clamp-2"
                }`}
              >
                {n.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleOpen(n)}
                  className="press inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-primary-foreground uppercase"
                >
                  {n.article ? (
                    <>
                      <Newspaper className="h-3.5 w-3.5" />
                      Ler a notícia
                    </>
                  ) : expanded[n.id] ? (
                    "Fechar aviso"
                  ) : (
                    "Abrir aviso"
                  )}
                </button>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markOne.mutate(n.id)}
                    className="press inline-flex items-center gap-1.5 rounded-sm border border-border px-3.5 py-2 text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground uppercase hover:border-primary/50 hover:text-primary"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Marcar como lida
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <section className="app-card flex flex-col items-center rounded-lg px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-border bg-secondary text-muted-foreground">
            <BellOff className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-xl tracking-tight">
            Você não possui novas notificações.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Quando houver uma nova publicação ou um aviso da sua conta, ele será
            exibido nesta área com título, mensagem, data e estado de leitura.
          </p>
        </section>
      )}
    </div>
  );
}
