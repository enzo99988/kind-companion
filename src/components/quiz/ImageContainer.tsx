import { cn } from "@/lib/utils";

export function ImageContainer({
  caption,
  src,
  size = "default",
}: {
  caption: string;
  src?: string | undefined;
  size?: "default" | "large" | undefined;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-md border border-border bg-[linear-gradient(165deg,var(--navy-soft),var(--navy-deep))]",
        size === "large" ? "aspect-[16/9]" : "aspect-[16/10] sm:aspect-[21/9]",
      )}
    >
      {src ? (
        <img
          src={src}
          alt={caption}
          loading="lazy"
          width={1280}
          height={720}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--navy-deep)_85%,transparent),transparent_55%)]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 px-4 pb-3 text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        {caption}
      </figcaption>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px gold-rule opacity-50" />
    </figure>
  );
}
