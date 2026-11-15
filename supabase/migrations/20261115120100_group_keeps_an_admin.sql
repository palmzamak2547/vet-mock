-- A study group keeps at least one admin.
--
-- What it closes. A member removes their own row from group_members (policy
-- "users self-delete group_members"), and nothing stopped the only admin
-- from doing so. The group then had nobody to look after it, and its invite
-- code stayed valid for anyone. The one group on production on 15 Nov 2026
-- had no members and no admin.
--
-- Now an admin who is the group's last admin cannot remove their own
-- membership: the delete is refused with 'Last admin cannot leave'. The
-- group page (GroupDetailView, src/lib/group-membership.js) already offers
-- that student no Leave button but "ลบกลุ่ม" instead, and src/lib/api.js
-- leaveGroup turns this refusal into Thai, so only a stale page meets it.
--
-- What it leaves alone: only a signed-in student removing their own row is
-- held. A group deleted by its creator (its members go by ON DELETE CASCADE,
-- after the group row is gone), an account deleted (cascade from auth.users,
-- run by the service role) and any service-role or SQL session pass.
--
-- Client first: nothing in the app depends on this being applied; before it
-- is, the page's rule is the only guard.
--
-- Undo:
--   DROP TRIGGER IF EXISTS group_keeps_an_admin ON public.group_members;
--   DROP FUNCTION IF EXISTS private.group_keeps_an_admin();

CREATE OR REPLACE FUNCTION private.group_keeps_an_admin() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF OLD.role = 'admin'
     AND (SELECT auth.uid()) IS NOT DISTINCT FROM OLD.user_id
     AND EXISTS (SELECT 1 FROM public.groups g WHERE g.id = OLD.group_id)
     AND NOT EXISTS (
       SELECT 1 FROM public.group_members m
       WHERE m.group_id = OLD.group_id AND m.role = 'admin' AND m.user_id <> OLD.user_id
     ) THEN
    RAISE EXCEPTION 'Last admin cannot leave' USING ERRCODE = '42501';
  END IF;
  RETURN OLD;
END;
$$;
REVOKE ALL ON FUNCTION private.group_keeps_an_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS group_keeps_an_admin ON public.group_members;
CREATE TRIGGER group_keeps_an_admin BEFORE DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION private.group_keeps_an_admin();
