import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="app-theme flex min-h-screen flex-col">
      <div className="h-1 w-full brasil-rule" />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="flex flex-col items-center gap-3 text-center">
            <BrandLogo variant="accent" className="h-12 w-12" />
            <span className="font-display text-xl tracking-tight sm:text-2xl">
              JORNAL DA PÁTRIA
            </span>
            <span className="text-[0.55rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
              Área do leitor
            </span>
          </Link>

          <div className="app-card mt-8 rounded-lg p-6 sm:p-8">
            <h1 className="font-display text-2xl leading-tight tracking-tight text-balance-editorial sm:text-3xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
            <div className="mt-7">{children}</div>
          </div>

          {footer ? (
            <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | undefined;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.68rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-sm border border-input bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring"
      />
      {error ? (
        <span className="mt-2 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}

export function SubmitButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      type="submit"
      disabled={loading || props.disabled}
      className="press w-full rounded-sm bg-primary px-6 py-4 text-[0.75rem] font-bold tracking-[0.16em] text-primary-foreground uppercase hover:bg-navy disabled:opacity-60"
    >
      {loading ? "Aguarde..." : children}
    </button>
  );
}
