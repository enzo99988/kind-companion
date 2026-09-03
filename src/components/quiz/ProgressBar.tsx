export function ProgressBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-foreground/90">{label}</span>
        <span className="font-display text-sm text-primary">
          {Math.round(value)}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-label={label}
        className="mt-2 h-2 w-full overflow-hidden rounded-full border border-border bg-navy-deep"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--verde),var(--gold))] transition-[width] duration-500"
          style={{
            width: `${value}%`,
            transitionTimingFunction: "var(--ease-editorial)",
          }}
        />
      </div>
    </div>
  );
}
