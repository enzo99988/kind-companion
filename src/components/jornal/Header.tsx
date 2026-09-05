import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";

const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "O Jornal", href: "#o-jornal" },
  { label: "Figuras", href: "#figuras" },
  { label: "Quiz", href: "#quiz", to: "/quiz" as const },
  { label: "Depoimentos", href: "#depoimentos" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map((n) => document.querySelector(n.href)).filter(
      (el): el is Element => Boolean(el),
    );
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);


  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-navy-deep/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="h-0.5 w-full gold-rule opacity-80" />
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <a href="#inicio" className="group flex min-w-0 items-center gap-3">
          <BrandLogo className="h-10 w-10" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none tracking-tight sm:text-xl">
              JORNAL DA PÁTRIA
            </span>
            <span className="mt-1 block truncate text-[0.6rem] font-semibold tracking-[0.22em] text-muted-foreground">
              EDIÇÃO DIGITAL
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.to ? (
              <Link
                key={item.href}
                to={item.to}
                className="group relative px-3 py-2 text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-foreground/75 transition-colors duration-[220ms] hover:text-primary"
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            ) : (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "true" : undefined}
              className={cn(
                "group relative px-3 py-2 text-[0.72rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-[220ms]",
                active === item.href
                  ? "text-primary"
                  : "text-foreground/75 hover:text-primary",
              )}
            >
              {item.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 bottom-1 h-px origin-left bg-primary transition-transform duration-300",
                  active === item.href
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </a>
            ),
          )}
          <Link
            to="/quiz"
            className="ml-3 inline-flex items-center rounded-sm bg-primary px-5 py-3 text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
          >
            Conheça o Jornal
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-border text-foreground transition-colors hover:border-primary/60 hover:text-primary lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-navy-deep/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4">
          {NAV.map((item) =>
            item.to ? (
              <Link
                key={item.href}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-border/60 py-4 text-xs font-semibold tracking-[0.18em] uppercase text-foreground/80 transition-colors duration-[220ms] hover:text-primary"
              >
                <span aria-hidden className="h-1 w-1 rounded-full bg-primary opacity-0" />
                {item.label}
              </Link>
            ) : (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active === item.href ? "true" : undefined}
              className={cn(
                "flex items-center gap-3 border-b border-border/60 py-4 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-[220ms]",
                active === item.href
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-1 w-1 rounded-full bg-primary transition-opacity",
                  active === item.href ? "opacity-100" : "opacity-0",
                )}
              />
              {item.label}
            </a>
            ),
          )}
          <Link
            to="/quiz"
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex justify-center rounded-sm bg-primary px-5 py-4 text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase"
          >
            Conheça o Jornal
          </Link>
        </nav>
      </div>
    </header>
  );
}
