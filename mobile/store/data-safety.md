# Data safety answers (Play Console: Policy and programs, App content, Data safety)

Each answer follows what the code does, with the file that does it. The declarations are the owner's to make;
if any answer here no longer matches the app, fix the app or this file before submitting.

## Data collection and security

| Question | Answer | Why |
|---|---|---|
| Does your app collect or share any of the required user data types? | Yes | Accounts (optional), synced study data, and with the student's consent analytics and error counts |
| Is all of the user data collected by your app encrypted in transit? | Yes | Every request is HTTPS (vetmock.com, Supabase); the app allows no cleartext traffic |
| Do you provide a way for users to request that their data is deleted? | Yes | In the app: ตั้งค่าบัญชี, ลบบัญชี (`supabase/functions/delete-account`). Web link for the form: https://vetmock.com/app/account |

## Data types

Collected means sent off the phone. "Optional" means the app works without it (no account, analytics declined).
Processing by Supabase, Vercel and the voice and explanation providers is on VetMock's behalf, which Play does not count
as sharing. Nothing is sold, and nothing is used for advertising.

| Data type | Collected | Shared | Optional | Purposes | Where in the code |
|---|---|---|---|---|---|
| Personal info: Email address | Yes | No | Yes (only with an account) | App functionality, Account management | `src/lib/supabase.js` sign-in |
| Personal info: Name (display name) | Yes | No | Yes | App functionality, Account management | profile, leaderboard settings |
| Personal info: User IDs (account ID) | Yes | No | Yes | App functionality, Account management | Supabase auth |
| Photos and videos: Photos (profile picture from the sign-in provider; a handwriting image sent for reading) | Yes | No | Yes | App functionality | profile; `api/transcribe-handwriting.js` |
| App activity: App interactions (progress, answers, bookmarks, reviews) | Yes | No | Yes (synced only with an account) | App functionality | `src/lib/user-data-sync.js` |
| App activity: Other user-generated content (notes, own questions, PDF annotations, feedback messages) | Yes | No | Yes | App functionality | user-data sync, `api/send-feedback.js` |
| App activity: page views (Vercel Web Analytics) | Yes | No | Yes (only after the student allows analytics) | Analytics | `src/App.jsx` Analytics |
| App info and performance: Diagnostics (error counts: release, page, error type; no message, no ID) | Yes | No | Yes (consent) | Analytics | `src/lib/client-diagnostics.js` |
| App info and performance: Other (page speed, Vercel Speed Insights) | Yes | No | Yes (consent) | Analytics | `src/App.jsx` SpeedInsights |

Not collected: location, contacts, calendar, files, financial info, health info, audio, device or advertising IDs.

Kept only on the phone (not collected): the widget's streak, today's count and next exam, the reminder time, the
theme choice. The reminder is computed and shown on the phone.

## One point for the owner to decide

While signed in, classmates who are also signed in see who is online, on which subject and question, with the name
and picture chosen in the leaderboard settings (privacy page, "เพื่อนร่วมรุ่นที่ออนไลน์"). That is shown to other
users of the app, not transferred to a company. Play's form counts transfers to third parties as sharing; if you read
this feature as sharing, mark Name and App interactions as shared, purpose App functionality.
