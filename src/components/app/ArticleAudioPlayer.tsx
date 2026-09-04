import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Headphones, Loader2, Pause, Play } from "lucide-react";
import { getArticleAudioUrl } from "@/lib/article-audio.functions";

function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ArticleAudioPlayer({ slug }: { slug: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["article-audio", slug],
    queryFn: () => getArticleAudioUrl({ data: { slug } }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setFailed(false);
  }, [data?.url]);

  const wrapper =
    "app-card mt-6 flex flex-col gap-3 rounded-lg border border-[color:var(--gold)]/40 p-4 sm:p-5";

  if (isPending) {
    return (
      <div className={wrapper}>
        <span className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparando o áudio…
        </span>
      </div>
    );
  }

  if (!data || data.status !== "ready" || !data.url || failed) {
    const message =
      data?.status === "generating"
        ? "O áudio desta notícia está sendo preparado. Volte em instantes."
        : data?.status === "stale"
          ? "O texto desta notícia foi atualizado. Um novo áudio será disponibilizado em breve."
          : "O áudio desta notícia ainda não está disponível.";
    return (
      <div className={wrapper}>
        <span className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
          <Headphones className="h-4 w-4" />
          Ouvir notícia
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>
      </div>
    );
  }

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => setFailed(true));
    } else {
      el.pause();
    }
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={wrapper}>
      <span className="flex items-center gap-2 text-[0.66rem] font-bold tracking-[0.16em] text-[color:var(--gold-ink)] uppercase">
        <Headphones className="h-4 w-4" />
        Ouvir notícia
      </span>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar áudio" : "Reproduzir áudio"}
          className="press inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/14 text-[color:var(--gold-ink)]"
        >
          {playing ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="relative h-2 w-full rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--gold)]"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              aria-label="Posição da reprodução"
              onChange={(e) => {
                const el = audioRef.current;
                if (!el) return;
                const next = Number(e.target.value);
                el.currentTime = next;
                setCurrent(next);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <div className="flex items-center justify-between text-[0.7rem] font-semibold text-muted-foreground tabular-nums">
            <span>{fmt(current)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={data.url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setFailed(true)}
        className="hidden"
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
