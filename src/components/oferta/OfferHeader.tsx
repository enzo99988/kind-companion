import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function OfferHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-navy-deep/90 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="h-0.5 w-full gold-rule opacity-80" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-primary/50 bg-navy font-display text-lg text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            J
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none tracking-tight sm:text-xl">
              JORNAL DA PÁTRIA
            </span>
            <span className="mt-1 block truncate text-[0.6rem] font-semibold tracking-[0.22em] text-muted-foreground">
              EDIÇÃO DIGITAL
            </span>
          </span>
        </Link>

        <Link
          to="/"
          className="text-[0.7rem] font-semibold tracking-[0.16em] text-foreground/75 uppercase transition-colors hover:text-primary"
        >
          Voltar ao Jornal
        </Link>
      </div>
    </header>
  );
}
