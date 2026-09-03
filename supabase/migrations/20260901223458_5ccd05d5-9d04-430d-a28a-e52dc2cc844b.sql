CREATE TABLE public.reader_access (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reader_access TO authenticated;
GRANT ALL ON public.reader_access TO service_role;

ALTER TABLE public.reader_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access" ON public.reader_access
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all access" ON public.reader_access
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can grant access" ON public.reader_access
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update access" ON public.reader_access
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can revoke access" ON public.reader_access
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER reader_access_set_updated_at
  BEFORE UPDATE ON public.reader_access
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION private.has_content_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.reader_access
    WHERE user_id = _user_id
      AND starts_at <= now()
      AND (ends_at IS NULL OR ends_at > now())
  );
$$;

DROP POLICY "Authenticated can read published articles" ON public.articles;

CREATE POLICY "Readers with active access can read published articles" ON public.articles
  FOR SELECT TO authenticated
  USING (status = 'published'::article_status AND private.has_content_access(auth.uid()));
