import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, CheckCircle2, ShieldCheck, Trash2, Users } from "lucide-react";
import {
  ACCESS_LABEL,
  deriveAccessStatus,
  fromDateInput,
  listReaderAccess,
  removeReaderAccess,
  setReaderAccess,
  toDateInput,
  type AccessStatus,
  type ReaderAccessRow,
} from "@/lib/reader-access";
import { Input } from "@/components/ui/input";
import { deleteUserAccount } from "@/lib/users.functions";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import {
  listUsersWithRoles,
  setUserRole,
  ROLE_LABEL,
  type AdminUser,
  type AdminUserRole,
} from "@/lib/users";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários — Painel | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Gestão de contas e níveis de acesso administrativo do Jornal da Pátria.",
      },
      { property: "og:title", content: "Usuários — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Gestão de leitores e permissões do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminUsuarios,
});

function AdminUsuarios() {
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [selected, setSelected] = useState<AdminUserRole>("user");
  const [accessTarget, setAccessTarget] = useState<AdminUser | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: me } = useQuery({
    queryKey: ["admin-current-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["admin-users"], queryFn: listUsersWithRoles });

  const { data: accessRows = [] } = useQuery({
    queryKey: ["admin-reader-access"],
    queryFn: listReaderAccess,
  });

  const accessById = new Map<string, ReaderAccessRow>(
    accessRows.map((row) => [row.user_id, row]),
  );

  const accessMutation = useMutation({
    mutationFn: async (input: {
      userId: string;
      remove: boolean;
      startsAt: string;
      endsAt: string | null;
    }) =>
      input.remove
        ? removeReaderAccess(input.userId)
        : setReaderAccess({
            userId: input.userId,
            startsAt: input.startsAt,
            endsAt: input.endsAt,
          }),
    onSuccess: async (_d, variables) => {
      setError(null);
      setFeedback(
        variables.remove
          ? "Acesso removido com sucesso."
          : "Acesso atualizado com sucesso.",
      );
      setAccessTarget(null);
      await queryClient.invalidateQueries({
        queryKey: ["admin-reader-access"],
      });
    },
    onError: (e: unknown) => {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível atualizar o acesso desta conta.",
      );
    },
  });

  function openAccessDialog(user: AdminUser) {
    setFeedback(null);
    setError(null);
    const row = accessById.get(user.id) ?? null;
    setStartDate(
      toDateInput(row?.starts_at ?? new Date().toISOString()) || "",
    );
    setEndDate(toDateInput(row?.ends_at ?? null));
    setAccessTarget(user);
  }

  const mutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminUserRole }) =>
      setUserRole(id, role),
    onSuccess: async (_data, variables) => {
      setError(null);
      setFeedback(
        `Função atualizada para "${ROLE_LABEL[variables.role]}" com sucesso.`,
      );
      setTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: unknown) => {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível alterar a função desta conta.",
      );
    },
  });

  const adminCount = users.filter((u) => u.role === "admin").length;

  const deleteFn = useServerFn(deleteUserAccount);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { userId: id } }),
    onSuccess: async () => {
      setError(null);
      setFeedback("Conta excluída com sucesso.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: unknown) => {
      setError(
        e instanceof Error ? e.message : "Não foi possível excluir esta conta.",
      );
    },
  });

  function openDialog(user: AdminUser) {
    setFeedback(null);
    setError(null);
    setSelected(user.role);
    setTarget(user);
  }

  function openDeleteDialog(user: AdminUser) {
    setFeedback(null);
    setError(null);
    setDeleteTarget(user);
  }

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        eyebrow="Pessoas"
        title="Usuários"
        description="Contas cadastradas no Jornal da Pátria e o nível de acesso de cada uma. A permissão é validada no banco de dados."
      />

      {feedback && (
        <div className="flex items-center gap-2 rounded-sm border border-primary/25 bg-primary/8 px-4 py-3 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {feedback}
        </div>
      )}
      {error && (
        <div className="rounded-sm border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="app-card overflow-hidden rounded-lg">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Carregando contas…
          </p>
        ) : isError ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Não foi possível carregar as contas.
          </p>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <span className="inline-grid h-11 w-11 place-items-center rounded-sm bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhuma conta cadastrada ainda.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {users.map((user) => {
              const isSelf = me?.id === user.id;
              const isLastAdmin = user.role === "admin" && adminCount <= 1;
              return (
                <li
                  key={user.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-base tracking-tight">
                      {user.display_name?.trim() || "Sem nome"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email ?? "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={
                        user.role === "admin"
                          ? "inline-flex items-center gap-1.5 rounded-sm border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/12 px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.12em] uppercase"
                          : "inline-flex items-center gap-1.5 rounded-sm border border-border bg-muted px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.12em] text-muted-foreground uppercase"
                      }
                    >
                      {user.role === "admin" && (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                      {ROLE_LABEL[user.role]}
                    </span>
                    <AccessBadge
                      status={deriveAccessStatus(accessById.get(user.id))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openAccessDialog(user)}
                    >
                      <CalendarClock className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">
                        Gerenciar acesso
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSelf}
                      title={
                        isSelf
                          ? "Não é possível alterar a própria função."
                          : undefined
                      }
                      onClick={() => openDialog(user)}
                    >
                      Alterar função
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={isSelf || isLastAdmin}
                      title={
                        isSelf
                          ? "Não é possível excluir a própria conta."
                          : isLastAdmin
                            ? "Não é possível excluir o último administrador."
                            : undefined
                      }
                      onClick={() => openDeleteDialog(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">Excluir</span>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Somente contas com função Administrador acessam o painel em /admin. A
        verificação acontece no banco de dados, e alterar elementos no navegador
        não concede permissão.
      </p>

      <Dialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
      >
        <DialogContent className="app-theme sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">
              Alterar função
            </DialogTitle>
            <DialogDescription>
              {target?.email ?? target?.display_name} · função atual:{" "}
              <strong>{target ? ROLE_LABEL[target.role] : ""}</strong>
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={selected}
            onValueChange={(v) => setSelected(v as AdminUserRole)}
            className="gap-3 py-2"
          >
            <div className="flex items-center gap-3 rounded-sm border border-border p-3">
              <RadioGroupItem value="user" id="role-user" />
              <Label htmlFor="role-user" className="cursor-pointer">
                Usuário — acesso apenas à área do leitor
              </Label>
            </div>
            <div className="flex items-center gap-3 rounded-sm border border-border p-3">
              <RadioGroupItem value="admin" id="role-admin" />
              <Label htmlFor="role-admin" className="cursor-pointer">
                Administrador — acesso ao painel /admin
              </Label>
            </div>
          </RadioGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={
                mutation.isPending || !target || selected === target.role
              }
              onClick={() =>
                target && mutation.mutate({ id: target.id, role: selected })
              }
            >
              {mutation.isPending ? "Salvando…" : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="app-theme sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">
              Excluir usuário
            </DialogTitle>
            <DialogDescription>
              Esta ação é permanente. A conta{" "}
              <strong>
                {deleteTarget?.email ?? deleteTarget?.display_name ?? "—"}
              </strong>{" "}
              será removida e não poderá mais fazer login.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending || !deleteTarget}
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
            >
              {deleteMutation.isPending ? "Excluindo…" : "Excluir conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={accessTarget !== null}
        onOpenChange={(open) => !open && setAccessTarget(null)}
      >
        <DialogContent className="app-theme sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">
              Gerenciar acesso
            </DialogTitle>
            <DialogDescription>
              {accessTarget?.email ?? accessTarget?.display_name} · status
              atual:{" "}
              <strong>
                {
                  ACCESS_LABEL[
                    deriveAccessStatus(
                      accessTarget ? accessById.get(accessTarget.id) : null,
                    )
                  ]
                }
              </strong>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="access-start">Início</Label>
              <Input
                id="access-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="access-end">Término</Label>
              <Input
                id="access-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Deixe o término em branco para acesso sem data de expiração. O
            status é calculado automaticamente pelas datas e validado no banco
            de dados.
          </p>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={
                accessMutation.isPending ||
                !accessTarget ||
                !accessById.has(accessTarget.id)
              }
              onClick={() =>
                accessTarget &&
                accessMutation.mutate({
                  userId: accessTarget.id,
                  remove: true,
                  startsAt: "",
                  endsAt: null,
                })
              }
            >
              Remover acesso
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAccessTarget(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={accessMutation.isPending || !accessTarget || !startDate}
                onClick={() =>
                  accessTarget &&
                  accessMutation.mutate({
                    userId: accessTarget.id,
                    remove: false,
                    startsAt:
                      fromDateInput(startDate) ?? new Date().toISOString(),
                    endsAt: fromDateInput(endDate, true),
                  })
                }
              >
                {accessMutation.isPending ? "Salvando…" : "Salvar acesso"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AccessBadge({ status }: { status: AccessStatus }) {
  const styles: Record<AccessStatus, string> = {
    active:
      "border-[color:var(--verde-ink)]/45 bg-[color:var(--verde-ink)]/10 text-[color:var(--verde-ink)]",
    expired: "border-destructive/40 bg-destructive/8 text-destructive",
    none: "border-border bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.12em] uppercase ${styles[status]}`}
    >
      {ACCESS_LABEL[status]}
    </span>
  );
}
