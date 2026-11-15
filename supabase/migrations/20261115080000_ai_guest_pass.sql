-- Trial links for the assistant on ai.vetmock.com (docs/CHULA-SIGNIN.md, "Trial links").
--
-- A person without a Chula account can be handed a link that opens the
-- assistant for a limited time. The link carries a code; this table keeps only
-- the code's SHA-256, an expiry and a message cap. The Vercel API
-- (api/_lib/guest-pass.js) asks public.ai_guest_pass_use with the public key,
-- the way it asks chula_access_state, so the pre-request below lets that one
-- call through.
--
-- Nothing else opens. The caller stays a guest with no account and no token, so
-- every policy and every other RPC refuse it as before, and the Chula-only
-- library stays closed. No table in public or vca is touched, no policy changes,
-- and chula_access_state is as it was.
--
-- A pass is made by the owner with one insert of a hash and an expiry, and ended
-- by setting revoked_at (the statements are in the docs). None is created here.

create schema if not exists private;

create table if not exists private.ai_guest_pass (
  id uuid primary key default gen_random_uuid(),
  -- lower-case hex of the code's SHA-256: the code itself is never stored
  code_sha256 text not null unique check (code_sha256 ~ '^[0-9a-f]{64}$'),
  note text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  max_messages integer not null default 200 check (max_messages > 0),
  used_messages integer not null default 0,
  revoked_at timestamptz
);
alter table private.ai_guest_pass enable row level security;
revoke all on private.ai_guest_pass from public, anon, authenticated;

-- Is this code good, and with p_count, one message of it is used.
--   { "ok": true, "expires_at": ..., "left": n }
--   { "ok": false, "reason": "invalid" | "expired" | "spent" }
-- An unknown code and a revoked one both read as invalid.
create or replace function public.ai_guest_pass_use(p_code text, p_count boolean default true) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_hash text;
  v_expires timestamptz;
  v_left integer;
  v_revoked boolean;
begin
  -- Refused before any lookup: a code is 22 to 64 characters of [A-Za-z0-9_-].
  if p_code is null or p_code !~ '^[A-Za-z0-9_-]{22,64}$' then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;
  v_hash := encode(sha256(convert_to(p_code, 'UTF8')), 'hex');

  if coalesce(p_count, true) then
    -- One statement checks and counts, so two requests at once cannot both
    -- take the last message: the second waits for the row and is judged again.
    update private.ai_guest_pass p
       set used_messages = p.used_messages + 1
     where p.code_sha256 = v_hash
       and p.revoked_at is null
       and p.expires_at > now()
       and p.used_messages < p.max_messages
    returning p.expires_at, p.max_messages - p.used_messages into v_expires, v_left;
    if found then
      return jsonb_build_object('ok', true, 'expires_at', v_expires, 'left', v_left);
    end if;
  end if;

  -- Not counted: say why, or (without p_count) whether it is good.
  select p.expires_at, p.max_messages - p.used_messages, p.revoked_at is not null
    into v_expires, v_left, v_revoked
    from private.ai_guest_pass p
   where p.code_sha256 = v_hash;
  if not found or v_revoked then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;
  if v_expires <= now() then
    return jsonb_build_object('ok', false, 'reason', 'expired');
  end if;
  if v_left <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'spent');
  end if;
  if coalesce(p_count, true) then
    -- The update refused it and the row reads as good now: it was edited in
    -- between. Never answer yes without having counted. The caller treats the
    -- error as "ask again", and the next request counts.
    raise exception using errcode = '40001', message = 'ai_guest_pass_changed';
  end if;
  return jsonb_build_object('ok', true, 'expires_at', v_expires, 'left', v_left);
end
$$;

revoke all on function public.ai_guest_pass_use(text, boolean) from public;
grant execute on function public.ai_guest_pass_use(text, boolean) to anon, authenticated;

-- The Data API gate of 20261101170000_chula_wall.sql, word for word, with one
-- more public call: ai_guest_pass_use is asked by our own server with the public
-- key before any sign-in, as chula_access_state is. It answers only whether the
-- code it is handed is good, and tells nothing about any account.
create or replace function public.chula_pre_request() returns void
language plpgsql stable security invoker set search_path = '' as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return;
  end if;
  -- chula_access_state: the wall's own state, read before sign-in.
  -- seeside_public_stats: an external site's public counters.
  -- record_client_diagnostic: crash counts, HMAC-signed by our own server.
  -- library_doc_for_signing: storage metadata only; the bytes need a link our
  --   server signs, and /api/library-file signs only for a member's bearer or
  --   a member's open ticket (api/_lib/open-ticket.js).
  -- ai_guest_pass_use: a trial link's code, checked by our own server.
  if coalesce(current_setting('request.path', true), '') in (
       '/rpc/chula_access_state',
       '/rpc/seeside_public_stats',
       '/rpc/record_client_diagnostic',
       '/rpc/library_doc_for_signing',
       '/rpc/ai_guest_pass_use') then
    return;
  end if;
  if public.chula_access() then
    return;
  end if;
  raise exception using errcode = '42501', message = 'chula_member_required',
    hint = 'Sign in with a Chula Google account (@student.chula.ac.th or @chula.ac.th).';
end
$$;

notify pgrst, 'reload schema';
