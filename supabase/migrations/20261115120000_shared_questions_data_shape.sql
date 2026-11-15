-- A shared question is a question: the database checks the JSON it is handed.
--
-- Written 15 Nov 2026. The pull request that adds this file does not apply it:
-- migrations here are applied by hand, after a second reader. Until then the
-- table is as it was.
--
-- public.shared_questions.data is `jsonb not null` and nothing more. A member
-- of a group may insert a row (policy sq_insert_member), so anything that
-- parses as JSON was accepted: a number, an array, an object with no question
-- in it, a megabyte of text. One row whose tags was a string blanked the whole
-- Shared tab until the page learnt to read rows defensively (readSharedQuestion
-- in src/lib/api.js). That guard lives in the page only.
--
-- The shape below is what the app writes and reads:
--   - shareQuestion (src/lib/api.js) writes a question object, the kind the
--     student's own question list holds (CUSTOM_QUESTION_SCHEMA in
--     src/lib/user-data-schema.js): `q` a non-empty string of at most 20,000
--     characters, `subject` a string of at most 100, `tags` at most 50 strings;
--   - readSharedQuestion shows a row only when data is an object whose `q` is a
--     string with something in it, and reads `subject` and `tags` beside it.
-- So: an object; `q` a string that is not blank, at most 20,000 characters;
-- `subject`, when given, a string of at most 100 characters; `tags`, when
-- given, a list of at most 50 strings; the whole value at most 1 MB. A key
-- given as null counts as not given. Other keys are left alone, as the app's
-- own validator leaves them.
--
-- The 1 MB is a choice, not a rule of the app: the fields that validator bounds
-- add up to 233,100 characters (about 700 KB in Thai), so no question a student
-- can keep in the app comes near it.
--
-- Two details that are easy to undo by accident:
--   - `is true`. A CHECK passes on NULL as well as on TRUE, and every test of a
--     missing key is NULL, so without it `{}` would be accepted.
--   - `strict` in the path. The default (lax) mode opens a list inside the
--     list before it tests, so `[["a"]]` would pass as a list of strings.
--
-- NOT VALID: the constraint is enforced for every row written from now on, and
-- rows already there are not looked at, so adding it does not scan the table.
-- No row is changed or deleted by this file.
--
-- Before validating, count the rows that break it (0 expected: the table was
-- empty on 15 Nov 2026):
--
--   select count(*) as violating from public.shared_questions where (
--     jsonb_typeof(data) = 'object'
--     and jsonb_typeof(data -> 'q') = 'string'
--     and btrim(data ->> 'q', E' \t\n\r') <> ''
--     and char_length(data ->> 'q') <= 20000
--     and case jsonb_typeof(data -> 'subject')
--           when 'string' then char_length(data ->> 'subject') <= 100
--           when 'null' then true
--           else data -> 'subject' is null
--         end
--     and case jsonb_typeof(data -> 'tags')
--           when 'array' then jsonb_array_length(data -> 'tags') <= 50
--             and not jsonb_path_exists(data -> 'tags', 'strict $[*] ? (@.type() != "string")')
--           when 'null' then true
--           else data -> 'tags' is null
--         end
--     and octet_length(data::text) <= 1048576
--   ) is not true;
--
-- A row it counts is a row the page already shows as "cannot be shown", or one
-- far larger than a question. Its author can delete it in the app; nothing here
-- deletes it. When the count is 0, validate (a scan under a lock that still
-- lets the table be read and written):
--
--   alter table public.shared_questions validate constraint shared_questions_data_shape;
--
-- To take it back:
--
--   alter table public.shared_questions drop constraint shared_questions_data_shape;

alter table public.shared_questions
  add constraint shared_questions_data_shape check ((
    jsonb_typeof(data) = 'object'
    and jsonb_typeof(data -> 'q') = 'string'
    and btrim(data ->> 'q', E' \t\n\r') <> ''
    and char_length(data ->> 'q') <= 20000
    and case jsonb_typeof(data -> 'subject')
          when 'string' then char_length(data ->> 'subject') <= 100
          when 'null' then true
          else data -> 'subject' is null
        end
    and case jsonb_typeof(data -> 'tags')
          when 'array' then jsonb_array_length(data -> 'tags') <= 50
            and not jsonb_path_exists(data -> 'tags', 'strict $[*] ? (@.type() != "string")')
          when 'null' then true
          else data -> 'tags' is null
        end
    and octet_length(data::text) <= 1048576
  ) is true) not valid;
