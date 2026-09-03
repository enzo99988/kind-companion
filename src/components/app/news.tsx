import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Newspaper, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, type ArticleWithCategory } from "@/lib/articles";

const TONE: Record<string, string> = {
  navy: "border-primary/25 bg-primary/8 text-primary",
  verde: "border-accent/30 bg-accent/10 text-[color:var(--verde-ink)]",
  gold: "border-[color:var(--gold)]/45 bg-[color:var(--gold)]/14 text-[color:var(--gold-ink)]",
};

export function CategoryTag({
  name,
  tone = "navy",
  className,
}: {
  name: string;
  tone?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.16em] uppercase",
        TONE[tone] ?? TONE["navy"],
        className,
      )}
    >
      {name}
    </span>
  );
}

function CoverImage({
  src,
  className,
}: {
  src: string | null;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-secondary text-muted-foreground",
          className,
        )}
      >
        <Newspaper className="h-8 w-8" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export function FeaturedArticle({ article }: { article: ArticleWithCategory }) {
  return (
    <article
      className={cn(
        "app-card app-lift overflow-hidden rounded-lg",
        article.featured &&
          "border border-[color:var(--gold)]/55 ring-1 ring-inset ring-[color:var(--gold)]/25",
      )}
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-80">
          <CoverImage src={article.cover_image_url} />
          <span className="absolute top-4 left-4 inline-flex items-center rounded-sm bg-primary px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.2em] text-primary-foreground uppercase">
            Manchete
          </span>
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {article.category && (
              <CategoryTag
                name={article.category.name}
                tone={article.category.tone}
              />
            )}
          </div>
          <h3 className="mt-4 font-display text-2xl leading-[1.12] tracking-tight text-balance-editorial sm:text-3xl">
            {article.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {article.summary}
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.72rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(article.published_at ?? article.created_at)}
            </div>
            {article.author_name && <div>{article.author_name}</div>}
          </dl>
          <Link
            to="/app/noticias/$slug"
            params={{ slug: article.slug }}
            className="press mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase hover:bg-navy sm:w-auto"
          >
            Ler notícia
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: ArticleWithCategory }) {
  const featured = !!article.featured;
  return (
    <article
      className={cn(
        "app-card app-lift flex flex-col overflow-hidden rounded-lg",
        featured &&
          "border border-[color:var(--gold)]/55 ring-1 ring-inset ring-[color:var(--gold)]/25",
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <CoverImage src={article.cover_image_url} />
        {featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm border border-[color:var(--gold)]/50 bg-card/95 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.18em] text-[color:var(--gold-ink)] uppercase backdrop-blur-sm">
            <Star className="h-3 w-3" />
            Destaque
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {article.category && (
          <CategoryTag
            name={article.category.name}
            tone={article.category.tone}
            className="self-start"
          />
        )}
        <h3 className="mt-3 font-display text-lg leading-snug tracking-tight">
          {article.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-4 flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(article.published_at ?? article.created_at)}
        </div>
        <Link
          to="/app/noticias/$slug"
          params={{ slug: article.slug }}
          className="press mt-5 inline-flex items-center justify-center gap-2 rounded-sm border border-primary/45 px-5 py-3 text-[0.68rem] font-bold tracking-[0.14em] text-primary uppercase hover:bg-primary hover:text-primary-foreground"
        >
          Ler notícia
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function EmptyNewsState({
  title = "Novas notícias em breve",
  description = "A redação do Jornal da Pátria está preparando as próximas publicações. Assim que uma notícia for publicada, ela aparece aqui.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="app-card rounded-lg p-10 text-center">
      <span className="inline-grid h-12 w-12 place-items-center rounded-sm bg-primary/10 text-primary">
        <Newspaper className="h-5 w-5" />
      </span>
      <h2 className="mt-5 font-display text-xl tracking-tight sm:text-2xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
