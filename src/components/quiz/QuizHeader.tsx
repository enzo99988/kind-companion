import { Link } from "@tanstack/react-router";
import { ProgressBar } from "./ProgressBar";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function QuizHeader({
  label,
  progress,
}: {
  label: string;
  progress: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-navy-deep/90 backdrop-blur-xl">
      <div className="h-0.5 w-full gold-rule opacity-80" />
      <div className="mx-auto max-w-4xl px-5 py-3 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <BrandLogo className="h-8 w-8" />
            <span className="truncate font-display text-sm tracking-tight sm:text-base">
              QUIZ DA PÁTRIA
            </span>
          </Link>
          <Link
            to="/"
            className="shrink-0 text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            Sair
          </Link>
        </div>
        <div className="mt-3">
          <ProgressBar label={label} value={progress} />
        </div>
      </div>
    </header>
  );
}
