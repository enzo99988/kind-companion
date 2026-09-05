import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Home, Newspaper, Bell, User, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isCurrentUserAdmin } from "@/lib/articles";
import { countUnreadNotifications } from "@/lib/notifications";
import { BrandLogo } from "@/components/brand/BrandLogo";

const NAV = [
  { to: "/app" as const, label: "Início", icon: Home },
  { to: "/app/noticias" as const, label: "Notícias", icon: Newspaper },
  { to: "/app/notificacoes" as const, label: "Notificações", icon: Bell },
  { to: "/app/minha-conta" as const, label: "Minha conta", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: isAdmin = false } = useQuery({
    queryKey: ["is-admin"],
    queryFn: isCurrentUserAdmin,
  });
  const { data: unread = 0 } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: countUnreadNotifications,
  });

  const badge = unread > 9 ? "9+" : String(unread);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/app/login", replace: true });
  }

  return (
    <div className="app-theme min-h-screen">
      <div className="h-1 w-full brasil-rule" />

      {/* Topo */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/app" className="flex min-w-0 items-center gap-3">
            <BrandLogo variant="accent" className="h-10 w-10" />
            <span className="min-w-0">
              <span className="block truncate font-display text-base leading-none tracking-tight sm:text-lg">
                JORNAL DA PÁTRIA
              </span>
              <span className="mt-1 block truncate text-[0.55rem] font-bold tracking-[0.22em] text-[color:var(--verde-ink)] uppercase">
                Área do leitor
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/app" }}
                activeProps={{
                  className:
                    "bg-primary/8 text-primary border-primary/25",
                  "aria-current": "page",
                }}
                inactiveProps={{
                  className: "border-transparent text-foreground/70",
                }}
                className="press inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[0.7rem] font-bold tracking-[0.13em] uppercase hover:text-primary"
              >
                {item.label}
                {item.to === "/app/notificacoes" && unread > 0 && (
                  <span
                    aria-label={`${unread} notificações não lidas`}
                    className="grid min-w-5 place-items-center rounded-full bg-[color:var(--gold)] px-1.5 py-0.5 text-[0.58rem] font-bold text-[color:var(--navy)]"
                  >
                    {badge}
                  </span>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="press ml-2 inline-flex items-center gap-2 rounded-sm border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/12 px-3 py-2 text-[0.7rem] font-bold tracking-[0.13em] text-[color:var(--gold-ink)] uppercase"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Painel
              </Link>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="press ml-2 inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-[0.7rem] font-bold tracking-[0.13em] text-foreground/70 uppercase hover:border-primary/50 hover:text-primary"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sair da conta"
            className="press grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border text-foreground/70 hover:border-primary/50 hover:text-primary md:hidden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-7 pb-28 sm:px-6 md:pb-14 lg:px-8">
        {children}
      </main>

      {/* Navegação inferior (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/app" }}
              activeProps={{ className: "text-primary", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="press flex min-h-16 flex-col items-center justify-center gap-1.5 px-1 py-2.5 text-[0.58rem] font-bold tracking-[0.08em] uppercase"
            >
              <span className="relative">
                <item.icon className="h-5 w-5" />
                {item.to === "/app/notificacoes" && unread > 0 && (
                  <span
                    aria-label={`${unread} notificações não lidas`}
                    className="absolute -top-1.5 -right-2.5 grid min-w-4 place-items-center rounded-full bg-[color:var(--gold)] px-1 text-[0.5rem] font-bold text-[color:var(--navy)]"
                  >
                    {badge}
                  </span>
                )}
              </span>
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
