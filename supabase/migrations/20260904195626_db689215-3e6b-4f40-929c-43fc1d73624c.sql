CREATE POLICY "Admins can read article audio"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'article-audio' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can upload article audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'article-audio' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update article audio"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'article-audio' AND private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'article-audio' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete article audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'article-audio' AND private.has_role(auth.uid(), 'admin'::app_role));