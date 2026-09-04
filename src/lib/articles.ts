import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ArticleStatus = Database["public"]["Enums"]["article_status"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
export type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
export type ArticleWithCategory = ArticleRow & {
  category: CategoryRow | null;
};

export const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: "Rascunho",
  review: "Em revisão",
  published: "Publicada",
};

export const STATUS_ORDER: ArticleStatus[] = ["draft", "review", "published"];

const SELECT = "*, category:categories(*)";

/* ------------------------------- utilitários ------------------------------ */

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------- categorias ------------------------------- */

export async function listCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/* --------------------------------- leitor -------------------------------- */

export async function listPublishedArticles(
  categorySlug?: string,
): Promise<ArticleWithCategory[]> {
  const query = supabase
    .from("articles")
    .select(SELECT)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  const list = (data ?? []) as unknown as ArticleWithCategory[];
  return categorySlug
    ? list.filter((a) => a.category?.slug === categorySlug)
    : list;
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<ArticleWithCategory | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ArticleWithCategory) ?? null;
}

/* ---------------------------------- admin -------------------------------- */

export type AdminFilters = {
  search?: string;
  status?: ArticleStatus | "all";
  categoryId?: string | "all";
  featured?: "all" | "yes" | "no";
  period?: "all" | "7" | "30" | "90";
};

export async function listAllArticles(
  filters: AdminFilters = {},
): Promise<ArticleWithCategory[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(SELECT)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  let list = (data ?? []) as unknown as ArticleWithCategory[];

  if (filters.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    list = list.filter((a) => a.title.toLowerCase().includes(term));
  }
  if (filters.status && filters.status !== "all") {
    list = list.filter((a) => a.status === filters.status);
  }
  if (filters.categoryId && filters.categoryId !== "all") {
    list = list.filter((a) => a.category_id === filters.categoryId);
  }
  if (filters.featured && filters.featured !== "all") {
    list = list.filter((a) => a.featured === (filters.featured === "yes"));
  }
  if (filters.period && filters.period !== "all") {
    const days = Number(filters.period);
    const limit = Date.now() - days * 86400000;
    list = list.filter((a) => new Date(a.created_at).getTime() >= limit);
  }
  return list;
}

export async function getArticleById(
  id: string,
): Promise<ArticleWithCategory | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ArticleWithCategory) ?? null;
}

export type ArticleFormValues = {
  title: string;
  summary: string;
  content: string;
  category_id: string | null;
  cover_image_url: string | null;
  sources: string;
  status: ArticleStatus;
  featured: boolean;
  send_as_notification: boolean;
  audio_enabled: boolean;
  published_at: string | null;
};

async function uniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const base = slugify(title) || `noticia-${Date.now()}`;
  const { data } = await supabase.from("articles").select("id, slug");
  const taken = new Set(
    (data ?? []).filter((r) => r.id !== ignoreId).map((r) => r.slug),
  );
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export async function createArticle(values: ArticleFormValues) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const slug = await uniqueSlug(values.title);
  const payload: ArticleInsert = {
    ...values,
    slug,
    author_id: user?.id ?? null,
    author_name:
      (user?.user_metadata?.["display_name"] as string | undefined) ??
      user?.email ??
      null,
    published_at:
      values.status === "published"
        ? (values.published_at ?? new Date().toISOString())
        : values.published_at,
  };
  const { data, error } = await supabase
    .from("articles")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateArticle(id: string, values: ArticleFormValues) {
  const existing = await getArticleById(id);
  const slug =
    existing && existing.title !== values.title
      ? await uniqueSlug(values.title, id)
      : (existing?.slug ?? (await uniqueSlug(values.title, id)));

  const { error } = await supabase
    .from("articles")
    .update({
      ...values,
      slug,
      published_at:
        values.status === "published"
          ? (values.published_at ??
            existing?.published_at ??
            new Date().toISOString())
          : values.published_at,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function setArticleStatus(id: string, status: ArticleStatus) {
  const existing = await getArticleById(id);
  const { error } = await supabase
    .from("articles")
    .update({
      status,
      published_at:
        status === "published"
          ? (existing?.published_at ?? new Date().toISOString())
          : existing?.published_at ?? null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function setArticleFeatured(id: string, featured: boolean) {
  const { error } = await supabase
    .from("articles")
    .update({ featured })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteArticle(id: string) {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return !!data;
}
