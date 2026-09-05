import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  Tags,
  Bell,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/brand/BrandLogo";

const NAV = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/noticias" as const, label: "Notícias", icon: Newspaper, exact: true },
  { to: "/admin/noticias/nova" as const, label: "Nova notícia", icon: PlusCircle, exact: true },
  { to: "/admin/categorias" as const, label: "Categorias", icon: Tags, exact: true },
  { to: "/admin/notificacoes" as const, label: "Notificações", icon: Bell, exact: true },
  { to: "/admin/usuarios" as const, label: "Usuários", icon: Users, exact: true },
  { to: "/admin/assinaturas" as const, label: "Assinaturas", icon: CreditCard, exact: true },
  { to: "/admin/configuracoes" as const, label: "Configurações", icon: Settings, exact: true },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/app/login", replace: true });
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: item.exact }}
          activeProps={{
            className: "bg-white/12 text-white border-l-[3px] border-[color:var(--gold)]",
            "aria-current": "page",
          }}
          inactiveProps={{
            className: "border-l-[3px] border-transparent text-white/65",
          }}
          className="flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-[0.78rem] font-semibold tracking-wide transition hover:bg-white/10 hover:text-white"
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="app-theme min-h-screen bg-background lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* Sidebar desktop */}
      <aside className="hidden bg-[color:var(--navy)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <BrandLogo variant="accent" className="h-10 w-10" />
          <span>
            <span className="block font-display text-sm leading-none tracking-tight text-white">
              JORNAL DA PÁTRIA
            </span>
            <span className="mt-1 block text-[0.55rem] font-bold tracking-[0.22em] text-[color:var(--gold)] uppercase">
              Painel editorial
            </span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
        <div className="border-t border-white/10 p-3">
          <Link
            to="/app"
            className="flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-[0.75rem] font-semibold text-white/65 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Área do leitor
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-sm px-3.5 py-2.5 text-[0.75rem] font-semibold text-white/65 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Topbar mobile */}
      <div className="flex flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-[color:var(--navy)] px-4 py-3 lg:hidden">
          <Link to="/admin" className="flex items-center gap-2.5">
            <BrandLogo variant="accent" className="h-9 w-9" />
            <span className="text-[0.6rem] font-bold tracking-[0.2em] text-white uppercase">
              Painel editorial
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="grid h-10 w-10 place-items-center rounded-sm border border-white/20 text-white"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </header>

        {open && (
          <div className="sticky top-[3.75rem] z-30 bg-[color:var(--navy)] px-3 pb-4 lg:hidden">
            {nav}
            <div className="mt-2 border-t border-white/10 pt-2">
              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-[0.75rem] font-semibold text-white/65"
              >
                <ExternalLink className="h-4 w-4" />
                Área do leitor
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-sm px-3.5 py-2.5 text-[0.75rem] font-semibold text-white/65"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        )}

        <main className="w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div className="min-w-0">
        {eyebrow && (
          <span className="text-[0.6rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function StatusPill({ status }: { status: "draft" | "review" | "published" }) {
  const map = {
    draft: "border-border bg-secondary text-muted-foreground",
    review:
      "border-[color:var(--gold)]/50 bg-[color:var(--gold)]/15 text-[color:var(--gold-ink)]",
    published: "border-accent/40 bg-accent/12 text-[color:var(--verde-ink)]",
  } as const;
  const label = { draft: "Rascunho", review: "Em revisão", published: "Publicada" };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.14em] uppercase ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}
