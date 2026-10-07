-- ============================================================
-- external_connections — per-user OAuth tokens for Notion / Google
-- ============================================================
-- One row per (user, provider). A student connects their own account so
-- the external-doc reader can open documents shared only with them.
--
-- The columns hold CREDENTIALS, so the table grants nothing to clients:
-- RLS is enabled with NO policies, which denies anon and authenticated
-- entirely. Only the service role (Vercel functions behind the student's
-- own Supabase JWT) reads or writes rows. What the UI shows about a
-- connection is decided server-side (provider, display label, scope,
-- expiry) — token columns never leave the function.
--
-- Rows cascade away with the account, so the existing account-deletion
-- flow cleans up without a new step.
-- ============================================================

create table if not exists public.external_connections (
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('google', 'notion')),
  account_label text,
  scope text,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, provider)
);

alter table public.external_connections enable row level security;

-- Deliberately no policy: a revoke (disconnect) deletes the row, and no
-- client — signed in or not — can select a token, ever.
