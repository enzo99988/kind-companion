import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, Field, SubmitButton } from "@/components/app/AuthLayout";

export const Route = createFileRoute("/app/recuperar-acesso")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Recuperar acesso — Jornal da Pátria" },
      {
        name: "description",
        content:
          "Receba as instruções para recuperar o acesso à sua conta do Jornal da Pátria.",
      },
      { property: "og:title", content: "Recuperar acesso — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Recupere o acesso à sua conta do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecuperarPage,
});

const schema = z.string().trim().min(1, "Informe seu e-mail.").email("E-mail inválido.");

function RecuperarPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "E-mail inválido.");
      setStatus("idle");
      return;
    }
    setError("");
    setStatus("loading");
    const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/app/redefinir-senha`,
    });
    setStatus(err ? "error" : "success");
  }

  return (
    <AuthLayout
      title="Recuperar acesso"
      subtitle="Digite seu e-mail para receber as instruções de recuperação da conta."
      footer={
        <Link to="/app/login" className="font-semibold text-primary transition-colors hover:text-gold-soft">
          Voltar para o login
        </Link>
      }
    >
      {status === "success" ? (
        <p className="rounded-sm border border-accent/40 bg-accent/10 px-4 py-4 text-sm leading-relaxed text-foreground">
          Instruções enviadas. Verifique sua caixa de entrada e siga o link para
          criar uma nova senha.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <Field
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            error={error}
          />
          {status === "error" ? (
            <p className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Não foi possível enviar as instruções agora. Tente novamente em
              alguns instantes.
            </p>
          ) : null}
          <SubmitButton loading={status === "loading"}>Enviar instruções</SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
