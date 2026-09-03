import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, Field, SubmitButton } from "@/components/app/AuthLayout";

export const Route = createFileRoute("/app/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — Área do leitor | Jornal da Pátria" },
      {
        name: "description",
        content:
          "Acesse sua área exclusiva do Jornal da Pátria e acompanhe as notícias do Brasil.",
      },
      { property: "og:title", content: "Entrar — Área do leitor" },
      {
        property: "og:description",
        content: "Acesse sua área exclusiva do Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().min(1, "Informe seu e-mail.").email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

function LoginPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      setFormError("Não foi possível entrar. Confira seu e-mail e senha.");
      return;
    }
    navigate({ to: "/app", replace: true });
  }

  return (
    <AuthLayout
      title="Bem-vindo ao Jornal da Pátria"
      subtitle="Acesse sua área exclusiva e acompanhe as notícias do Brasil."
      footer={
        <>
          <Link to="/app/recuperar-acesso" className="text-muted-foreground transition-colors hover:text-primary">
            Esqueci minha senha
          </Link>
          <Link to="/app/cadastro" className="font-semibold text-primary transition-colors hover:text-gold-soft">
            Ainda não tenho uma conta
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Field
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={errors['email']}
        />
        <Field
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors['password']}
        />
        {formError ? (
          <p className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {formError}
          </p>
        ) : null}
        <SubmitButton loading={loading}>Entrar</SubmitButton>
      </form>
    </AuthLayout>
  );
}
