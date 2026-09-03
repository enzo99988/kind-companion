import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const { ref, props } = useReveal<HTMLDivElement>(delay);
  const Component = Tag as "div";
  return (
    <Component ref={ref} {...props} className={cn("reveal", className)}>
      {children}
    </Component>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div
        className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-px w-10 gold-rule" />
        <span className="eyebrow text-primary">{eyebrow}</span>
      </div>
      <h2 className="mt-6 text-balance-editorial text-[clamp(1.9rem,4.4vw,3.35rem)] leading-[1.02] tracking-[-0.015em]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
