import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, Field, SubmitButton } from "@/components/app/AuthLayout";

export const Route = createFileRoute("/app/cadastro")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Criar conta — Jornal da Pátria" },
      {
        name: "description",
        content: "Cadastre-se para acessar a área exclusiva do Jornal da Pátria.",
      },
      { property: "og:title", content: "Criar conta — Jornal da Pátria" },
      {
        property: "og:description",
        content: "Cadastre-se para acessar o Jornal da Pátria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CadastroPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome completo.").max(120, "Nome muito longo."),
    email: z.string().trim().min(1, "Informe seu e-mail.").email("E-mail inválido."),
    password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres."),
    confirm: z.string().min(1, "Confirme sua senha."),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "As senhas não são iguais.",
  });

function CadastroPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
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
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/app/login`,
        data: { display_name: parsed.data.name },
      },
    });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      setFormError(
        msg.includes("already")
          ? "Este e-mail já possui uma conta. Tente entrar."
          : msg.includes("weak") || msg.includes("pwned")
            ? "Esta senha é muito comum e insegura. Escolha uma senha mais forte."
            : "Não foi possível criar sua conta agora. Tente novamente.",
      );
      return;
    }

    if (!data.session) {
      setCheckEmail(true);
      return;
    }
    navigate({ to: "/app", replace: true });
  }

  if (checkEmail) {
    return (
      <AuthLayout
        title="Confirme seu e-mail"
        subtitle="Enviamos um link de confirmação para o seu e-mail. Confirme para acessar sua área exclusiva."
        footer={
          <Link to="/app/login" className="font-semibold text-primary hover:text-gold-soft">
            Voltar para o login
          </Link>
        }
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Não encontrou a mensagem? Verifique a caixa de spam ou promoções.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Cadastre-se para acessar o Jornal da Pátria."
      footer={
        <Link to="/app/login" className="font-semibold text-primary transition-colors hover:text-gold-soft">
          Já tenho uma conta
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Field label="Nome" name="name" autoComplete="name" placeholder="Seu nome" error={errors['name']} />
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
        <SubmitButton loading={loading}>Criar conta</SubmitButton>
      </form>
    </AuthLayout>
  );
}
