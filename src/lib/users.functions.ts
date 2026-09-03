import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Exclui definitivamente uma conta. A autorização é validada no servidor:
 * o chamador precisa ter o papel "admin" no banco de dados, não pode excluir
 * a própria conta e não pode remover o último administrador.
 */
export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { userId } = data;

    if (userId === context.userId) {
      throw new Error("Não é possível excluir a própria conta.");
    }

    const { data: callerRoles, error: callerError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin");

    if (callerError) throw new Error("Não foi possível validar suas permissões.");
    if (!callerRoles || callerRoles.length === 0) {
      throw new Error("Apenas administradores podem excluir contas.");
    }

    const { data: admins, error: adminsError } = await context.supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (adminsError) throw new Error("Não foi possível validar os administradores.");

    const isTargetAdmin = (admins ?? []).some((r) => r.user_id === userId);
    if (isTargetAdmin && (admins ?? []).length <= 1) {
      throw new Error("Não é possível excluir o último administrador.");
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error("Não foi possível excluir esta conta.");

    return { ok: true };
  });
