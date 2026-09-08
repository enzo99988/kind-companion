import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  event: z.string().min(1).max(100).optional(),
  event_type: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(100).optional(),
  status: z.string().max(100).optional(),
  event_id: z.string().max(200).optional(),
  id: z.string().max(200).optional(),
  sale_id: z.string().max(200).optional(),
  checkout_id: z.string().max(200).optional(),
  subscription_id: z.string().max(200).optional(),
  plan: z
    .object({ code: z.string().max(200).optional(), name: z.string().max(200).optional() })
    .partial()
    .optional(),
  offer: z
    .object({ id: z.string().max(200).optional(), name: z.string().max(200).optional() })
    .partial()
    .optional(),
  offer_name: z.string().max(200).optional(),
  plan_code: z.string().max(200).optional(),
  customer: z
    .object({ email: z.string().max(320).optional(), name: z.string().max(200).optional() })
    .partial()
    .optional(),
  email: z.string().max(320).optional(),
  subscription: z
    .object({
      id: z.string().max(200).optional(),
      status: z.string().max(100).optional(),
      plan: z.string().max(200).optional(),
      next_charge_date: z.string().max(64).optional(),
      started_at: z.string().max(64).optional(),
      ends_at: z.string().max(64).optional(),
      expires_at: z.string().max(64).optional(),
    })
    .partial()
    .optional(),
  next_charge_date: z.string().max(64).optional(),
  expires_at: z.string().max(64).optional(),
  ends_at: z.string().max(64).optional(),
  product_name: z.string().max(200).optional(),
  products: z
    .array(z.object({ name: z.string().max(200).optional(), offer_name: z.string().max(200).optional() }).partial())
    .max(20)
    .optional(),
});

type Payload = z.infer<typeof payloadSchema>;

const GRANT_EVENTS = new Set([
  "sale_approved",
  "sale.approved",
  "purchase_approved",
  "subscription_renewed",
  "subscription.renewed",
  "subscription_charged",
  "subscription_activated",
  "subscription.activated",
]);
const CANCEL_EVENTS = new Set([
  "subscription_canceled",
  "subscription_cancelled",
  "subscription.canceled",
  "sale_canceled",
]);
const EXPIRE_EVENTS = new Set(["subscription_expired", "subscription.expired", "subscription_ended"]);
const REFUND_EVENTS = new Set([
  "sale_refunded",
  "sale.refunded",
  "sale_chargeback",
  "sale.chargeback",
  "refund",
  "chargeback",
]);

function normalizeEvent(p: Payload): string {
  return (p.event ?? p.event_type ?? p.type ?? p.status ?? "").toString().trim().toLowerCase().replace(/\s+/g, "_");
}

function pickEmail(p: Payload): string | null {
  const email = (p.customer?.email ?? p.email ?? "").trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : null;
}

function pickEventId(p: Payload, eventName: string): string {
  const base = p.event_id ?? p.id ?? p.sale_id ?? p.checkout_id ?? p.subscription?.id ?? p.subscription_id;
  return base ? `${eventName}:${base}` : `${eventName}:${crypto.randomUUID()}`;
}

function parseDate(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/public/kirvano-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["KIRVANO_WEBHOOK_TOKEN"];
        if (!secret) return new Response("Webhook not configured", { status: 503 });

        const provided =
          request.headers.get("x-kirvano-token") ??
          request.headers.get("security-token") ??
          request.headers.get("x-webhook-token") ??
          (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        if (!provided || !safeEqual(provided, secret)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = payloadSchema.safeParse(raw);
        if (!parsed.success) return new Response("Invalid payload", { status: 400 });
        const payload = parsed.data;

        const eventName = normalizeEvent(payload);
        if (!eventName) return new Response("Missing event", { status: 400 });

        const eventId = pickEventId(payload, eventName);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Idempotency: reject duplicates up-front.
        const { error: insertEventError } = await supabaseAdmin
          .from("payment_webhook_events")
          .insert({ provider: "kirvano", event_id: eventId, event_type: eventName, status: "received" });
        if (insertEventError) {
          if (insertEventError.code === "23505") {
            return Response.json({ ok: true, duplicate: true });
          }
          return new Response("Storage error", { status: 500 });
        }

        const finish = async (status: string, message?: string, subscriptionId?: string | null) => {
          await supabaseAdmin
            .from("payment_webhook_events")
            .update({
              status,
              error_message: message ?? null,
              processed_at: new Date().toISOString(),
              subscription_id: subscriptionId ?? null,
            })
            .eq("provider", "kirvano")
            .eq("event_id", eventId);
        };

        const known =
          GRANT_EVENTS.has(eventName) ||
          CANCEL_EVENTS.has(eventName) ||
          EXPIRE_EVENTS.has(eventName) ||
          REFUND_EVENTS.has(eventName);
        if (!known) {
          await finish("ignored", `Evento não tratado: ${eventName}`);
          return Response.json({ ok: true, ignored: true });
        }

        const email = pickEmail(payload);
        if (!email) {
          await finish("error", "E-mail do comprador ausente ou inválido");
          return Response.json({ ok: false, error: "missing_email" }, { status: 202 });
        }

        try {
          // Locate or create the auth user by email.
          let userId: string | null = null;
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .ilike("email", email)
            .maybeSingle();
          userId = profile?.id ?? null;

          if (!userId && GRANT_EVENTS.has(eventName)) {
            const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
              email,
              email_confirm: true,
              user_metadata: { display_name: payload.customer?.name ?? "" },
            });
            if (createError && !/already/i.test(createError.message)) throw createError;
            userId = created?.user?.id ?? null;
            if (!userId) {
              const { data: retry } = await supabaseAdmin
                .from("profiles")
                .select("id")
                .ilike("email", email)
                .maybeSingle();
              userId = retry?.id ?? null;
            }
          }

          const offerName =
            payload.offer_name ?? payload.offer?.name ?? payload.plan?.name ?? payload.products?.[0]?.offer_name ?? null;
          const planCode = payload.plan_code ?? payload.plan?.code ?? payload.offer?.id ?? null;
          const providerSaleId = payload.sale_id ?? payload.checkout_id ?? payload.id ?? null;
          const providerSubscriptionId = payload.subscription?.id ?? payload.subscription_id ?? null;
          const endsAt =
            parseDate(payload.subscription?.ends_at) ??
            parseDate(payload.subscription?.expires_at) ??
            parseDate(payload.subscription?.next_charge_date) ??
            parseDate(payload.ends_at) ??
            parseDate(payload.expires_at) ??
            parseDate(payload.next_charge_date);

          // Find existing subscription for this buyer.
          const { data: existing } = await supabaseAdmin
            .from("subscriptions")
            .select("id, ends_at, started_at")
            .eq("provider", "kirvano")
            .ilike("email", email)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const nowIso = new Date().toISOString();
          let subscriptionId = existing?.id ?? null;

          if (GRANT_EVENTS.has(eventName)) {
            const values = {
              user_id: userId,
              email,
              provider: "kirvano",
              provider_sale_id: providerSaleId,
              provider_subscription_id: providerSubscriptionId,
              offer_name: offerName,
              plan_code: planCode,
              status: "active",
              ends_at: endsAt,
              canceled_at: null,
              refunded_at: null,
            };
            if (subscriptionId) {
              await supabaseAdmin.from("subscriptions").update(values).eq("id", subscriptionId);
            } else {
              const { data: inserted, error } = await supabaseAdmin
                .from("subscriptions")
                .insert({ ...values, started_at: nowIso })
                .select("id")
                .single();
              if (error) throw error;
              subscriptionId = inserted.id;
            }

            if (userId) {
              const { data: access } = await supabaseAdmin
                .from("reader_access")
                .select("user_id")
                .eq("user_id", userId)
                .maybeSingle();
              if (access) {
                await supabaseAdmin.from("reader_access").update({ ends_at: endsAt }).eq("user_id", userId);
              } else {
                await supabaseAdmin
                  .from("reader_access")
                  .insert({ user_id: userId, starts_at: nowIso, ends_at: endsAt });
              }
            }
          } else if (CANCEL_EVENTS.has(eventName)) {
            // Keep history: mark canceled, access stays until ends_at.
            if (subscriptionId) {
              await supabaseAdmin
                .from("subscriptions")
                .update({ status: "canceled", canceled_at: nowIso })
                .eq("id", subscriptionId);
            }
          } else if (EXPIRE_EVENTS.has(eventName) || REFUND_EVENTS.has(eventName)) {
            const refunded = REFUND_EVENTS.has(eventName);
            if (subscriptionId) {
              await supabaseAdmin
                .from("subscriptions")
                .update({
                  status: refunded ? "refunded" : "expired",
                  ends_at: nowIso,
                  ...(refunded ? { refunded_at: nowIso } : {}),
                })
                .eq("id", subscriptionId);
            }
            if (userId) {
              await supabaseAdmin.from("reader_access").update({ ends_at: nowIso }).eq("user_id", userId);
            }
          }

          await finish("processed", undefined, subscriptionId);
          return Response.json({ ok: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erro desconhecido";
          await finish("error", message.slice(0, 500));
          return new Response("Processing error", { status: 500 });
        }
      },
    },
  },
});
