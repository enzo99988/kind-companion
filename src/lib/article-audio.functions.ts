import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TTS_MODEL = "openai/gpt-4o-mini-tts";
const TTS_VOICE = "alloy";
const BUCKET = "article-audio";

/** Divide o texto em blocos pequenos para respeitar o limite do modelo. */
function chunkForTTS(text: string, maxWords = 350): string[] {
  const wordCount = (s: string) => (s.match(/\S+/g) ?? []).length;
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };
  for (const sentence of sentences) {
    if (wordCount(sentence) > maxWords) {
      flush();
      const words = sentence.match(/\S+/g) ?? [];
      for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(" "));
      }
      continue;
    }
    if (current && wordCount(current) + wordCount(sentence) > maxWords) flush();
    current += sentence;
  }
  flush();
  return chunks;
}

function narrationText(article: {
  title: string;
  summary: string;
  content: string;
}): string {
  return [article.title, article.summary, article.content]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join("\n\n");
}

async function assertAdmin(context: {
  supabase: { rpc: (fn: string, args: unknown) => Promise<{ data: unknown }> };
  userId: string;
}) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Acesso restrito a administradores.");
}

/* ------------------------- geração (administrador) ------------------------ */

export const generateArticleAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { articleId: string }) => {
    if (!input?.articleId) throw new Error("Notícia não informada.");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // Confere se o usuário é administrador de fato (RLS também protege).
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Acesso restrito a administradores.");

    const { data: article, error: readError } = await supabase
      .from("articles")
      .select("id, title, summary, content, audio_path")
      .eq("id", data.articleId)
      .maybeSingle();
    if (readError) throw readError;
    if (!article) throw new Error("Notícia não encontrada.");

    const text = narrationText(article);
    if (text.length < 40) {
      throw new Error("A notícia precisa de mais texto para gerar o áudio.");
    }

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error(
        "A geração de voz não está configurada neste ambiente (LOVABLE_API_KEY ausente).",
      );
    }

    await supabase
      .from("articles")
      .update({ audio_status: "generating", audio_error: null })
      .eq("id", article.id);

    try {
      const parts: Uint8Array[] = [];
      for (const chunk of chunkForTTS(text)) {
        const response = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/speech",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: TTS_MODEL,
              input: chunk,
              voice: TTS_VOICE,
              response_format: "mp3",
              instructions:
                "Leia como um locutor de telejornal brasileiro: tom firme, claro e calmo, em português do Brasil.",
            }),
          },
        );
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          if (response.status === 429) {
            throw new Error(
              "Limite de uso da geração de voz atingido. Tente novamente em alguns minutos.",
            );
          }
          if (response.status === 402) {
            throw new Error(
              "Créditos de IA insuficientes para gerar o áudio. Adicione créditos e tente novamente.",
            );
          }
          throw new Error(
            `Falha na geração de voz (${response.status}). ${detail.slice(0, 200)}`,
          );
        }
        parts.push(new Uint8Array(await response.arrayBuffer()));
      }

      const total = parts.reduce((sum, p) => sum + p.length, 0);
      const audio = new Uint8Array(total);
      let offset = 0;
      for (const part of parts) {
        audio.set(part, offset);
        offset += part.length;
      }

      const path = `${article.id}/${Date.now()}.mp3`;
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
      if (uploadError) throw uploadError;

      if (article.audio_path && article.audio_path !== path) {
        await supabaseAdmin.storage.from(BUCKET).remove([article.audio_path]);
      }

      const { error: updateError } = await supabase
        .from("articles")
        .update({
          audio_path: path,
          audio_url: null,
          audio_status: "ready",
          audio_error: null,
          audio_enabled: true,
          audio_generated_at: new Date().toISOString(),
        })
        .eq("id", article.id);
      if (updateError) throw updateError;

      return { ok: true as const, status: "ready" as const };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao gerar o áudio.";
      await supabase
        .from("articles")
        .update({ audio_status: "error", audio_error: message })
        .eq("id", article.id);
      throw new Error(message);
    }
  });

/* ------------------------ remoção (administrador) ------------------------- */

export const deleteArticleAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { articleId: string }) => {
    if (!input?.articleId) throw new Error("Notícia não informada.");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Acesso restrito a administradores.");

    const { data: article } = await supabase
      .from("articles")
      .select("id, audio_path")
      .eq("id", data.articleId)
      .maybeSingle();
    if (!article) throw new Error("Notícia não encontrada.");

    if (article.audio_path) {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin.storage.from(BUCKET).remove([article.audio_path]);
    }

    const { error } = await supabase
      .from("articles")
      .update({
        audio_path: null,
        audio_url: null,
        audio_status: "none",
        audio_error: null,
        audio_generated_at: null,
      })
      .eq("id", article.id);
    if (error) throw error;
    return { ok: true as const };
  });

/* ---------------------------- leitura (leitor) ---------------------------- */

export const getArticleAudioUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string }) => {
    if (!input?.slug) throw new Error("Notícia não informada.");
    return input;
  })
  .handler(async ({ data, context }) => {
    // RLS garante que só leitores com acesso ativo leem notícias publicadas.
    const { data: article, error } = await context.supabase
      .from("articles")
      .select("id, audio_enabled, audio_status, audio_path")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    if (!article) return { status: "unavailable" as const, url: null };

    if (
      !article.audio_enabled ||
      article.audio_status !== "ready" ||
      !article.audio_path
    ) {
      return {
        status:
          article.audio_status === "generating"
            ? ("generating" as const)
            : article.audio_status === "stale"
              ? ("stale" as const)
              : ("unavailable" as const),
        url: null,
      };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(article.audio_path, 60 * 60);
    if (signError || !signed?.signedUrl) {
      return { status: "unavailable" as const, url: null };
    }
    return { status: "ready" as const, url: signed.signedUrl };
  });

export { assertAdmin };
