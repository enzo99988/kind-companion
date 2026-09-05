import { Instagram } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "O Jornal", href: "#o-jornal" },
  { label: "Figuras", href: "#figuras" },
  { label: "Quiz", href: "#quiz" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#cta" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-deep">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_0.8fr]">
          <div>
            <div className="flex min-w-0 items-center gap-3">
              <BrandLogo className="h-10 w-10" />
              <span className="font-display text-xl tracking-tight">
                JORNAL DA PÁTRIA
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Notícias, análises e contextos sobre os principais acontecimentos
              do Brasil.
            </p>
            <span className="mt-6 block h-px w-24 gold-rule" />
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="eyebrow text-primary">Navegação</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-primary">Institucional</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-border pt-6">
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jornal da Pátria
          </p>
          <p className="shrink-0 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Conteúdo Editorial
          </p>
        </div>
      </div>
    </footer>
  );
}
