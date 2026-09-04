ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS audio_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS audio_url text,
  ADD COLUMN IF NOT EXISTS audio_path text,
  ADD COLUMN IF NOT EXISTS audio_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS audio_error text,
  ADD COLUMN IF NOT EXISTS audio_generated_at timestamp with time zone;

CREATE OR REPLACE FUNCTION public.mark_article_audio_stale()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF (NEW.title IS DISTINCT FROM OLD.title
      OR NEW.summary IS DISTINCT FROM OLD.summary
      OR NEW.content IS DISTINCT FROM OLD.content)
     AND OLD.audio_status = 'ready'
     AND NEW.audio_status = OLD.audio_status THEN
    NEW.audio_status := 'stale';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS articles_audio_stale ON public.articles;
CREATE TRIGGER articles_audio_stale
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.mark_article_audio_stale();