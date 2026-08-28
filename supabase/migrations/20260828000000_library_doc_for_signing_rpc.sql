-- library_doc_for_signing(slug) — the signing fields for ONE published doc,
-- with the login rule enforced HERE, at the data layer, rather than only in
-- the Vercel function that happens to call it.
--
-- Why this exists: /api/library-file needs storage_key to presign an R2
-- URL, and storage_key is deliberately invisible to the browser's own
-- grants (a guessable key is a bypassable gate). The obvious fix — read it
-- with the service key — puts a standing admin secret in the serverless
-- environment for one SELECT. A definer RPC exposes exactly these fields,
-- to exactly these callers, and nothing else. (Bonus discovered while
-- building it: no service key exists on this machine at all, so the RPC is
-- not just tighter, it is the only path that ships.)
--
-- The contract:
--   draft / archived      → no row. Indistinguishable from a missing slug,
--                           so drafts cannot be enumerated.
--   public                → full row for anyone, including anon.
--   restricted, logged in → full row.
--   restricted, anon      → row with storage_key NULL. The caller learns
--                           the doc exists (it is in the public catalog
--                           anyway) and answers 401 instead of 404, which
--                           is what lets the UI say "log in first".
--
-- Applied live via MCP 2026-08-28; this file is the repo's copy of record.
CREATE OR REPLACE FUNCTION public.library_doc_for_signing(p_slug text)
RETURNS TABLE (
  slug text,
  status text,
  storage_provider text,
  storage_bucket text,
  storage_key text,
  mime text,
  byte_size bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    d.slug,
    d.status,
    d.storage_provider,
    d.storage_bucket,
    CASE
      WHEN d.status = 'public' THEN d.storage_key
      WHEN d.status = 'restricted' AND auth.uid() IS NOT NULL THEN d.storage_key
      ELSE NULL
    END AS storage_key,
    d.mime,
    d.byte_size
  FROM public.library_docs d
  WHERE d.slug = p_slug
    AND d.status IN ('public', 'restricted')
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.library_doc_for_signing(text) FROM public;
GRANT EXECUTE ON FUNCTION public.library_doc_for_signing(text) TO anon, authenticated;
