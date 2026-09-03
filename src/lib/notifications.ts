import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type NotificationRow =
  Database["public"]["Tables"]["notifications"]["Row"];

export type NotificationWithArticle = NotificationRow & {
  article: { id: string; slug: string; title: string } | null;
};

export type ReaderNotification = NotificationWithArticle & {
  read: boolean;
};

const SELECT = "*, article:articles(id, slug, title)";

/* --------------------------------- admin --------------------------------- */

export async function listNotifications(): Promise<NotificationWithArticle[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NotificationWithArticle[];
}

export async function getNotification(
  id: string,
): Promise<NotificationWithArticle | null> {
  const { data, error } = await supabase
    .from("notifications")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as NotificationWithArticle | null) ?? null;
}

export type NotificationInput = {
  title: string;
  message: string;
  article_id: string | null;
  is_active: boolean;
};

export async function createNotification(input: NotificationInput) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("notifications").insert({
    ...input,
    created_by: userData.user?.id ?? null,
  });
  if (error) throw error;
}

export async function updateNotification(id: string, input: NotificationInput) {
  const { error } = await supabase
    .from("notifications")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw error;
}

/* --------------------------------- leitor -------------------------------- */

export async function listReaderNotifications(): Promise<ReaderNotification[]> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return [];

  const [{ data: rows, error }, { data: reads, error: readsError }] =
    await Promise.all([
      supabase
        .from("notifications")
        .select(SELECT)
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("notification_reads")
        .select("notification_id")
        .eq("user_id", userId),
    ]);
  if (error) throw error;
  if (readsError) throw readsError;

  const readSet = new Set((reads ?? []).map((r) => r.notification_id));
  return ((rows ?? []) as NotificationWithArticle[]).map((n) => ({
    ...n,
    read: readSet.has(n.id),
  }));
}

export async function markNotificationRead(notificationId: string) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;
  const { error } = await supabase
    .from("notification_reads")
    .upsert(
      { notification_id: notificationId, user_id: userId },
      { onConflict: "notification_id,user_id", ignoreDuplicates: true },
    );
  if (error) throw error;
}

export async function markAllNotificationsRead(ids: string[]) {
  if (!ids.length) return;
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;
  const { error } = await supabase.from("notification_reads").upsert(
    ids.map((notification_id) => ({ notification_id, user_id: userId })),
    { onConflict: "notification_id,user_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}

export async function countUnreadNotifications(): Promise<number> {
  const rows = await listReaderNotifications();
  return rows.filter((r) => !r.read).length;
}
