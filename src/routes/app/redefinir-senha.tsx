import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, Field, SubmitButton } from "@/components/app/AuthLayout";

export const Route = createFileRoute("/app/redefinir-senha")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nova senha — Jornal da Pátria" },
      {
        name: "description",
        content: "Defina uma nova senha para sua conta do Jornal da Pátria.",
      },
      { property: "og:title", content: "Nova senha — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Defina uma nova senha de acesso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RedefinirPage,
});

const schema = z
  .object({
    password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres."),
    confirm: z.string().min(1, "Confirme sua senha."),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "As senhas não são iguais.",
  });

function RedefinirPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      password: form.get("password"),
      confirm: form.get("confirm"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) {
      setFormError(
        "Não foi possível atualizar a senha. Solicite um novo link de recuperação.",
      );
      return;
    }
    navigate({ to: "/app", replace: true });
  }

  return (
    <AuthLayout
      title="Definir nova senha"
      subtitle="Escolha uma nova senha para acessar sua área exclusiva."
      footer={
        <Link to="/app/login" className="font-semibold text-primary transition-colors hover:text-gold-soft">
          Voltar para o login
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Field
          label="Nova senha"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors['password']}
        />
        <Field
          label="Confirmar senha"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors['confirm']}
        />
        {formError ? (
          <p className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {formError}
          </p>
        ) : null}
        <SubmitButton loading={loading}>Salvar nova senha</SubmitButton>
      </form>
    </AuthLayout>
  );
}
