import { supabase } from "@/integrations/supabase/client";

export type AdminUserRole = "admin" | "user";

export type AdminUser = {
  id: string;
  display_name: string | null;
  email: string | null;
  account_status: string;
  created_at: string;
  role: AdminUserRole;
};

export const ROLE_LABEL: Record<AdminUserRole, string> = {
  admin: "Administrador",
  user: "Usuário",
};

/** Lista contas cadastradas com a função atual (RLS permite somente a admins). */
export async function listUsersWithRoles(): Promise<AdminUser[]> {
  const [{ data: profiles, error }, { data: roles, error: rolesError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, display_name, email, account_status, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);

  if (error) throw error;
  if (rolesError) throw rolesError;

  const admins = new Set(
    (roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id),
  );

  return (profiles ?? []).map((p) => ({
    ...p,
    role: admins.has(p.id) ? ("admin" as const) : ("user" as const),
  }));
}

/**
 * Altera a função de uma conta. A autorização é aplicada no banco de dados:
 * apenas quem já é administrador pode inserir/remover papéis, e nunca no
 * próprio usuário.
 */
export async function setUserRole(
  userId: string,
  role: AdminUserRole,
): Promise<void> {
  if (role === "admin") {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (error && error.code !== "23505") throw error;
    return;
  }

  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", "admin");
  if (error) throw error;
}
