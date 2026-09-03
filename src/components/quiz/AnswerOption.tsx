import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnswerOption({
  index,
  label,
  selected,
  onSelect,
}: {
  index: number;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const letter = String.fromCharCode(65 + index);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-md border px-4 py-4 text-left transition-all duration-[220ms] sm:px-5",
        selected
          ? "border-primary/70 bg-[color-mix(in_oklab,var(--gold)_12%,var(--navy))]"
          : "border-border bg-navy/60 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-navy/80",
      )}
      style={{ transitionTimingFunction: "var(--ease-editorial)" }}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-sm border font-display text-sm transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-primary",
        )}
      >
        {letter}
      </span>
      <span className="text-sm leading-snug text-foreground/95 sm:text-base">
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all",
          selected
            ? "border-accent bg-accent text-accent-foreground opacity-100"
            : "border-border opacity-40",
        )}
      >
        {selected ? <Check className="h-3 w-3" /> : null}
      </span>
    </button>
  );
}
