import { Link } from "@tanstack/react-router";

export function OfferFooter() {
  return (
    <footer className="border-t border-border bg-navy-deep">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-sm border border-primary/50 font-display text-lg text-primary">
              J
            </span>
            <span className="font-display text-xl tracking-tight">
              JORNAL DA PÁTRIA
            </span>
          </Link>
          <p className="text-center text-xs text-muted-foreground sm:text-right">
            © {new Date().getFullYear()} Jornal da Pátria. Conteúdo Editorial.
          </p>
        </div>
      </div>
    </footer>
  );
}
