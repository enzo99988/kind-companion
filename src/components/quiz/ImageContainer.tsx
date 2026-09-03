import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageContainer({
  caption,
  size = "default",
}: {
  caption: string;
  size?: "default" | "large" | undefined;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-md border border-border bg-[linear-gradient(165deg,var(--navy-soft),var(--navy-deep))]",
        size === "large" ? "aspect-[16/9]" : "aspect-[16/10] sm:aspect-[21/9]",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklab,var(--azul)_28%,transparent),transparent_70%)]"
      />
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <span className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-primary/40 text-primary">
            <Camera className="h-4 w-4" />
          </span>
          <figcaption className="mt-3 text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {caption}
          </figcaption>
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px gold-rule opacity-50" />
    </figure>
  );
}
