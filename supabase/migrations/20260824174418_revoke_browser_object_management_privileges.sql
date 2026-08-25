-- Old project defaults granted browser roles object-management privileges
-- they never need. PostgREST exposes CRUD only; TRUNCATE/REFERENCES/TRIGGER
-- should not be latent capabilities, and anonymous writes go through vetted
-- SECURITY DEFINER RPCs such as record_daily_q_pulse.
revoke truncate, references, trigger on all tables in schema public
  from anon, authenticated;
revoke insert, update, delete on all tables in schema public from anon;

alter default privileges for role postgres in schema public
  revoke truncate, references, trigger on tables from anon, authenticated;
