-- Admins can list all profiles (needed for the Users screen)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Admins can grant roles to other users (never to themselves)
GRANT INSERT, DELETE ON public.user_roles TO authenticated;

CREATE POLICY "Admins can grant roles to others"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  private.has_role(auth.uid(), 'admin'::app_role)
  AND user_id <> auth.uid()
);

CREATE POLICY "Admins can revoke roles from others"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  private.has_role(auth.uid(), 'admin'::app_role)
  AND user_id <> auth.uid()
);