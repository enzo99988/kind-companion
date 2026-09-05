import logo from "@/assets/brand/logo.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** Tailwind size classes, e.g. "h-10 w-10". */
  className?: string;
  /**
   * "original" — official mark, untouched (landing, oferta, checkout, quiz).
   * "accent" — same mark with a very subtle blue/green/gold accent ring (app/admin).
   */
  variant?: "original" | "accent";
  alt?: string;
};

export function BrandLogo({
  className,
  variant = "original",
  alt = "Jornal da Pátria",
}: BrandLogoProps) {
  const img = (
    <img
      src={logo}
      alt={alt}
      loading="eager"
      decoding="async"
      className="h-full w-full object-contain"
    />
  );

  if (variant === "accent") {
    return (
      <span
        className={cn(
          "relative inline-grid shrink-0 place-items-center rounded-full p-px",
          className,
        )}
        style={{
          background:
            "conic-gradient(from 210deg, color-mix(in oklab, var(--verde) 38%, transparent) 0deg, color-mix(in oklab, var(--gold) 45%, transparent) 130deg, color-mix(in oklab, var(--navy) 30%, transparent) 250deg, color-mix(in oklab, var(--verde) 38%, transparent) 360deg)",
        }}
      >
        <span className="grid h-full w-full place-items-center overflow-hidden rounded-full">
          {img}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-grid shrink-0 place-items-center", className)}>
      {img}
    </span>
  );
}
