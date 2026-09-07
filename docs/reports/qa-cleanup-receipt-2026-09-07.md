# VetMock v5.81.1 verification and QA cleanup receipt — 7 September 2026

This receipt closes the remediation register in
[audit-remediation-2026-09-07.md](../audit-remediation-2026-09-07.md). It
records what was verified for the released commit, how the temporary QA
accounts were removed, and what remains deferred. It contains no credentials,
tokens, keys or personal data of real users.

## 1. Released commit, CI and deployment

| Item | Value |
| --- | --- |
| Released commit | `a88c85b4c752e1a6e1b3d48f98bf25b9017fec71` (v5.81.1, `main`) |
| GitHub Actions Build | run 34093846299 (#682), push event, exact SHA, conclusion success |
| GitHub Actions Smoke e2e | run 34093846472 (#303), push event, exact SHA, conclusion success |
| Vercel deployment | `dpl_ArCREENRMut9xLDYXH5jW5biJY5L`, target production, state READY, meta `githubCommitSha` = a88c85b |
| Production aliases on that deployment | `vetmock.vercel.app`, `vetmock-palmzamak2547s-projects.vercel.app`, `vetmock-git-main-palmzamak2547s-projects.vercel.app` |
| Live service worker | `https://vetmock.vercel.app/sw.js` serves `SW_VERSION = 'v152-2026-09-07'` (fetched through the Vercel deployment fetcher, 200) |
| Live entry document | `https://vetmock.vercel.app/` serves `/assets/main-Dlb_wADD.js`; response carries the CSP, Permissions-Policy (`publickey-credentials-get=(self)`), HSTS and `Referrer-Policy` headers from `vercel.json` |

A local production build of the same commit reproduced the `vendor-react`,
`app-lifecycle` and both stylesheet chunk hashes byte-for-byte. Only the
`main` chunk differs, because the local build did not receive the deployment's
public environment values (Google and LINE client identifiers). The deployment
record above, not the hash comparison, is the authority for what is live.

Local gates on a88c85b: `npm run test:unit` 761 pass / 0 fail; `npm run build`
succeeded and left the tree clean.

## 2. Isolated browser check

The session that produced this receipt runs behind an egress policy that
refuses CONNECT to `vetmock.vercel.app` and to the Supabase auth origin, and
that policy must not be routed around. The user-visible flows were therefore
exercised in Chromium 141 against the production bundle built from the same
source, served locally under a non-localhost hostname (the app disables
diagnostics on localhost) with every Supabase request answered by an
in-browser network mock. No production data and no real account was touched.

Result: 48 checks, 47 pass and 1 product finding (section 4). The
`vmx-stay-signed-in` assertion now expects `'0'`; the earlier QA script
expected `'false'`, which the product never wrote.

| Area | Verified in the browser |
| --- | --- |
| Diagnostics before consent | Consent card shown; an uncaught error produced no request to `/api/client-diagnostic` (server and browser both observed zero) |
| Diagnostics after consent | Exactly one POST per distinct error with body keys `category`, `kind`, `release`, `view` only (75 bytes); `release` matched the bundle version; the injected message, email, path and token text were absent; no `Referer`, `Cookie` or `Authorization` header; identical errors deduplicated; a second category reported with the same bounded fields |
| Diagnostics after withdrawal | Privacy page showed the allowed state, withdrawal switched it to not allowed and stored `essential`; later errors and errors after a reload produced no request |
| Stay signed in unticked | Box defaults to checked; unticking stores `'0'`; after sign-in the token lived in `sessionStorage` only; a reload on an app route still showed the account; a new tab was signed out |
| Device-only logout | The request carried `scope=local`; both storages lost the token; the header returned to the signed-out state |
| Stay signed in ticked | Stores `'1'`; token in `localStorage` only; logout again `scope=local` |
| Passkeys (CDP virtual authenticator) | Secure context with `PublicKeyCredential`; the passkey button rendered on the sign-in form; account settings offered enrolment; a real WebAuthn registration ceremony stored one resident credential for the page's relying-party id and sent that credential id to the verify call; the list showed the new passkey; after a local logout, a real authentication ceremony signed the account back in with the enrolled credential |

Not verified here, because it needs the production origin or the identity
provider: passkey registration against the real relying party
`vetmock.vercel.app`, and the provider-side proof that a second session stays
refreshable after a `scope=local` logout. The client contract for both is
verified above; the provider behaviour was validated by the release itself
("two independent live sessions") and remains the identity provider's
documented semantics.

## 3. Temporary QA account cleanup

Only the two synthetic accounts created for this audit were removed. They
were identified by the `vmxqa-<id>@example.invalid` pattern and by creation
time; no other account matched any example or test-domain pattern.

| Account | Created (UTC) | Deleted (UTC) |
| --- | --- | --- |
| `vmxqa-5721610a93@example.invalid` (`ab751944-3ff1-43ea-8b8b-af472fe3db64`) | 2026-09-07 06:04:27 | 2026-09-07 08:39:18 |
| `vmxqa-bd76d136dd@example.invalid` (`58be5ac8-c119-49c3-9e05-ac04fc7b3487`) | 2026-09-07 06:04:27 | 2026-09-07 08:39:18 |

Method: one `DELETE FROM auth.users` restricted to both ids and to the
synthetic email pattern, through the project's authorized database
connection. Every dependent table references `auth.users` (directly, or
through `profiles`) with `ON DELETE CASCADE`; the four race rooms were hosted
by these accounts and held no other member or result.

Footprint before and after, for both accounts combined:

| Table | Before | After |
| --- | --- | --- |
| auth.users / identities / sessions / refresh_tokens / mfa_amr_claims | 2 / 2 / 5 / 8 / 5 | 0 |
| auth.webauthn_credentials | 3 | 0 |
| public.profiles / user_data | 2 / 2 | 0 |
| public.exam_results | 7 | 0 |
| public.race_results | 5 | 0 |
| public.study_event_batches | 3 | 0 |
| private.race_rooms (host) / race_members | 4 / 8 | 0 |
| private.study_event_limits | 1 | 0 |
| pdf_annotations, q_comments, groups, group_members, imaging, library, shared questions, submissions, reviews, group_join_rate_limits | 0 | 0 |

Totals moved exactly by that footprint (users 34 to 32, profiles 29 to 27,
exam_results 237 to 230, race tables and study-event tables to 0) and no
orphan race result remained. `private.client_error_counts` has no user
column and held 0 rows. Three expired `auth.webauthn_challenges` rows from 2
and 8 August 2026 carry no user id and predate this audit; they were left
alone. No real user row was read for modification or changed.

## 4. Finding fixed in the follow-up (v5.81.2)

Dismissing the passkey prompt, or using a device with no passkey, showed the
generic red "sign-in failed" banner on the sign-in form and on the account
settings enrolment button. The browser reports both as `NotAllowedError`, but
the auth SDK wraps that error with a passthrough `code`, and both handlers
tested `code || name`, so the dismissal branch never matched. The follow-up
adds one shared check that also reads `name` and `cause`, uses it in both
handlers, and covers the SDK-wrapped shape with unit tests. On the v5.81.2
bundle the same 48 browser checks pass, including the dismissal case: the
challenge options are fetched, no verify call follows, the form stays usable
and no failure banner appears.

Gates on the follow-up: `npm run test:unit` 764 pass / 0 fail, `npm run
lint:all` and `npm run lint:atlas` clean, `npm run build` succeeded. The
service worker version moves to v153 because the entry chunk changed. This
branch is not deployed by itself; production changes only when the follow-up
reaches `main` and passes the Build and Smoke checks that gate the alias.

## 5. Deferred and honest boundaries

Unchanged from the register: 65 held questions, 166 length and 25 position
warnings, 43.9% governed note coverage, 4,727 questions without explicit
wikiRefs, current course-scope expansion and Atlas expert review. No medical
answer, figure, provenance or efficacy claim was added. Leaked-password
protection through the provider's managed setting still requires the Pro plan
(the management API answered 402); no plan change was made.

No local QA server or background process from this verification remains
running; all temporary scripts and logs lived outside the repository.
