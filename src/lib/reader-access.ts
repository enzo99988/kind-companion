import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ReaderAccessRow =
  Database["public"]["Tables"]["reader_access"]["Row"];

export type AccessStatus = "none" | "active" | "expired";

export const ACCESS_LABEL: Record<AccessStatus, string> = {
  none: "Sem acesso",
  active: "Acesso ativo",
  expired: "Acesso expirado",
};

/** Deriva o status a partir das datas — a mesma regra aplicada no banco. */
export function deriveAccessStatus(
  row: Pick<ReaderAccessRow, "starts_at" | "ends_at"> | null | undefined,
): AccessStatus {
  if (!row) return "none";
  const now = Date.now();
  const start = new Date(row.starts_at).getTime();
  const end = row.ends_at ? new Date(row.ends_at).getTime() : null;
  if (start > now) return "none";
  if (end !== null && end <= now) return "expired";
  return "active";
}

/** Lista os acessos de leitores (RLS permite somente a administradores). */
export async function listReaderAccess(): Promise<ReaderAccessRow[]> {
  const { data, error } = await supabase.from("reader_access").select("*");
  if (error) throw error;
  return data ?? [];
}

/** Acesso do próprio usuário autenticado. */
export async function getMyAccess(): Promise<ReaderAccessRow | null> {
  const { data: auth } = await supabase.auth.getUser();
  const id = auth.user?.id;
  if (!id) return null;
  const { data, error } = await supabase
    .from("reader_access")
    .select("*")
    .eq("user_id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Cria/atualiza o período de acesso. Autorização aplicada por RLS. */
export async function setReaderAccess(input: {
  userId: string;
  startsAt: string;
  endsAt: string | null;
}): Promise<void> {
  const { error } = await supabase.from("reader_access").upsert(
    {
      user_id: input.userId,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}

/** Remove o acesso do leitor. Autorização aplicada por RLS. */
export async function removeReaderAccess(userId: string): Promise<void> {
  const { error } = await supabase
    .from("reader_access")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

export function toDateInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateInput(value: string, endOfDay = false): string | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return endOfDay
    ? new Date(y, m - 1, d, 23, 59, 59).toISOString()
    : new Date(y, m - 1, d, 0, 0, 0).toISOString();
}
